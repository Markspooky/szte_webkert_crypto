import { Component, inject, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CryptoApiService } from '../../services/crypto-api.service';

// ÚJ: Közvetlenül a hivatalos Chart.js-t hívjuk be!
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-coin-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule], 
  template: `
    <h2 mat-dialog-title>
      <img *ngIf="data?.image" [src]="data.image" style="width: 24px; vertical-align: middle; margin-right: 8px;">
      {{ data?.name }} ({{ data?.symbol | uppercase }}) - 7 Napos Árfolyam
    </h2>
    
    <mat-dialog-content>
      <div *ngIf="isLoading" style="text-align: center; padding: 50px; color: #888;">
        <p>⏳ Grafikon adatainak letöltése a tőzsdéről...</p>
      </div>

      <div *ngIf="errorMessage" style="text-align: center; padding: 50px; color: #ff5252;">
        <p>⚠️ {{ errorMessage }}</p>
      </div>

      <div [hidden]="!isChartReady" style="position: relative; width: 100%; height: 300px; padding-top: 15px;">
        <canvas #chartCanvas></canvas>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Bezárás</button>
    </mat-dialog-actions>
  `
})
export class CoinDetailsDialog implements OnInit {
  public data = inject(MAT_DIALOG_DATA);
  private cryptoApi = inject(CryptoApiService);
  private cdr = inject(ChangeDetectorRef);

  // Ezzel fogjuk meg a HTML-ben lévő canvas elemet
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  
  // Ebben tároljuk magát a grafikont
  chartInstance: any;

  isLoading = true;
  isChartReady = false;
  errorMessage = '';

  ngOnInit() {
    if (!this.data?.id) {
      this.showError('Hiányzó érme azonosító!');
      return;
    }

    this.cryptoApi.getCoinHistory(this.data.id).subscribe({
      next: (res) => {
        const prices = res.prices;
        if (!prices || prices.length === 0) {
          this.showError('Nem találhatók áradatok.');
          return;
        }

        const labels = prices.map((p: any) => new Date(p[0]).toLocaleDateString());
        const dataPoints = prices.map((p: any) => p[1]);

        this.isLoading = false;
        this.isChartReady = true;
        this.cdr.detectChanges(); // Frissítjük a HTML-t, hogy megjelenjen a canvas

        // Amint az Angular kirajzolta a canvas-t, mi rögtön ráfestjük a Chart.js-sel
        setTimeout(() => {
          this.createChart(labels, dataPoints);
        }, 0);
      },
      error: (err) => {
        if (err.status === 429) {
          this.showError('Túl sok kérés! A CoinGecko ideiglenesen blokkolt. Várj 1 percet!');
        } else {
          this.showError('Hiba történt az adatok letöltésekor.');
        }
      }
    });
  }

  // A függvény, ami megépíti a gyönyörű lila grafikont
  createChart(labels: string[], dataPoints: number[]) {
    // Biztonsági törlés, ha már lenne egy grafikon
    if (this.chartInstance) {
      this.chartInstance.destroy(); 
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Árfolyam (USD)',
          data: dataPoints,
          borderColor: '#bb86fc', // Lila vonal
          backgroundColor: 'rgba(187, 134, 252, 0.2)', // Áttetsző lila kitöltés
          fill: true,
          pointRadius: 0, // Bogyók elrejtése
          tension: 0.4 // Kisimított görbe
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { display: false } // Alsó dátumok elrejtése a tiszta dizájnért
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  showError(msg: string) {
    this.isLoading = false;
    this.errorMessage = msg;
    this.cdr.detectChanges();
  }
}