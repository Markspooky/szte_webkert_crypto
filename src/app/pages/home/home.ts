import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';


// Gombok és Ikonok importálása
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Felugró ablak és az Adatbázis szolgáltatás
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddAssetDialog } from '../portfolio/add-asset-dialog';
import { PortfolioService } from '../../services/portfolio.service';

import { CryptoApiService, CoinData } from '../../services/crypto-api.service';

import { CoinDetailsDialog } from '../coin-details/coin-details-dialog';

@Component({
  selector: 'app-home',
  standalone: true,
  // Bővítettük a modulok listáját
  imports: [CommonModule, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  private cryptoApi = inject(CryptoApiService);
  private portfolioService = inject(PortfolioService);
  private dialog = inject(MatDialog);

  private cdr = inject(ChangeDetectorRef);

  topCoins: CoinData[] = [];
  
  // Hozzáadtuk az 'actions' (műveletek) oszlopot a listához
  displayedColumns: string[] = ['image', 'name', 'current_price', 'change', 'actions'];

  isLoading = true;
  errorMessage = '';

  ngOnInit() {
    this.loadMarketData();
  }

  loadMarketData() {
    // Betöltés indításakor alaphelyzetbe állítjuk az értékeket
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.cryptoApi.getTopCoins().subscribe({
      next: (data) => {
        this.topCoins = [...data];
        this.isLoading = false; // Sikeres betöltés
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Hiba az árak lekérésekor:', err);
        this.isLoading = false;
        
        // Ha 429-es hibát kapunk (Too Many Requests)
        if (err.status === 429) {
          this.errorMessage = 'Túl sok kérés! A CoinGecko ideiglenesen letiltott. Kérlek, várj 1 percet!';
        } else {
          // Minden más hiba esetén (pl. nincs internet)
          this.errorMessage = 'Hiba történt az adatok betöltésekor. Ellenőrizd a kapcsolatot!';
        }
        this.cdr.detectChanges();
      }
    });
  }

  // Ez a függvény nyitja meg a felugró ablakot a kiválasztott érme adataival
  openBuyDialog(coin: CoinData) {
    const dialogRef = this.dialog.open(AddAssetDialog, {
      width: '400px',
      // Itt adjuk át az adatokat az ablaknak!
      data: { 
        name: coin.name, 
        symbol: coin.symbol.toUpperCase(), 
        value: coin.current_price 
      }
    });

    // Figyeljük, mi történik, miután bezárult az ablak
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        try {
          await this.portfolioService.addAsset(result);
          // Egy pici böngészős értesítés a sikeres tranzakcióról
          alert(`${result.amount} ${result.symbol} sikeresen hozzáadva a portfóliódhoz!`);
        } catch (err) {
          console.error('Hiba a mentés során:', err);
        }
      }
    });
  }

  openDetailsDialog(coin: CoinData) {
    this.dialog.open(CoinDetailsDialog, {
      width: '600px', // Szélesebb ablak kell a grafikonnak
      data: coin // Átküldjük a teljes érme adatot
    });
  }

}