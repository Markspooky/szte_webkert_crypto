import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddAssetDialog } from './add-asset-dialog';
import { PortfolioService, CryptoAsset } from '../../services/portfolio.service';

// ÚJ IMPORTOK AZ ÉLŐ ÁRAKHOZ
import { CryptoApiService } from '../../services/crypto-api.service';
import { firstValueFrom } from 'rxjs'; // Ezzel alakítjuk a folyamatos adatot egyszeri letöltéssé

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule, RouterModule, MatDialogModule],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss'
})
export class Portfolio implements OnInit {
  private auth = inject(Auth);
  private portfolioService = inject(PortfolioService);
  private dialog = inject(MatDialog);
  private cdr = inject(ChangeDetectorRef);
  
  // Beinjektáljuk az API szolgáltatást is
  private cryptoApi = inject(CryptoApiService);
  
  user$ = authState(this.auth);

  displayedColumns: string[] = ['asset', 'amount', 'value', 'actions'];
  dataSource: any[] = []; // Kicsit lazábbra vettük a típust, mert új mezőket adunk hozzá
  totalBalance = 0;

  ngOnInit() {
    this.user$.subscribe(user => {
      if (user) {
        this.refreshData();
      }
    });
  }

  // A MEGÚJULT ADATBETÖLTŐ FÜGGVÉNY
  async refreshData() {
    try {
      // 1. Letöltjük a saját darabszámaidat a Firebase-ből
      const dbData = await this.portfolioService.getPortfolioOnce();
      
      // 2. Letöltjük az ÉLŐ árakat a CoinGecko-ról
      // A firstValueFrom megvárja, amíg az API válaszol, és utána megy csak tovább a kód
      const liveCoins = await firstValueFrom(this.cryptoApi.getTopCoins());

      let newTotal = 0;

      // 3. Összepárosítjuk a kettőt!
      const updatedData = dbData.map(item => {
        // Megkeressük az adott érmét a letöltött élő adatok között (szimbólum alapján)
        const liveCoin = liveCoins.find(c => c.symbol.toLowerCase() === item.symbol.toLowerCase());
        
        // Ha megtaláltuk, használjuk az élő árat, ha nem (mert pl. nincs a top 10-ben), marad a régi érték
        const currentPrice = liveCoin ? liveCoin.current_price : 0;
        
        // Kiszámoljuk az élő értéket: (Saját darabszám * Élő ár)
        const liveValue = currentPrice > 0 ? (item.amount * currentPrice) : item.value;

        newTotal += liveValue;

        // Visszaadjuk a kibővített adatot a táblázatnak
        return {
          ...item,
          livePrice: currentPrice, // Ezt is eltesszük, ha ki akarnád írni a HTML-ben
          value: liveValue // Felülírjuk az értéket az élő értékkel!
        };
      });

      console.log('Élő adatokkal frissített portfólió:', updatedData);
      
      this.dataSource = [...updatedData];
      this.totalBalance = newTotal;
      
      this.cdr.detectChanges(); 
      
    } catch (error) {
      console.error('Hiba a betöltéskor:', error);
    }
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddAssetDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(async (result: CryptoAsset) => {
      if (result) {
        try {
          await this.portfolioService.addAsset(result);
          this.refreshData();
        } catch (err) {
          console.error('Hiba történt a mentésnél:', err);
        }
      }
    });
  }

  async deleteItem(id: string) {
    if (window.confirm('Biztosan törlöd ezt a tételt?')) {
      try {
        await this.portfolioService.deleteAsset(id);
        this.refreshData();
      } catch (err) {
        console.error('Hiba a törlésnél:', err);
      }
    }
  }
}