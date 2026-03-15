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

 async refreshData() {
    try {
      // 1. Letöltjük a nyers adatokat a Firebase-ből
      const dbData = await this.portfolioService.getPortfolioOnce();
      
      // ÚJ: CSOPORTOSÍTÁS SZIMBÓLUM ALAPJÁN
      const groupedAssets = new Map<string, any>();
      
      for (const item of dbData) {
        const sym = item.symbol.toUpperCase();
        
        if (groupedAssets.has(sym)) {
          // Ha már van ilyen érménk a listában, csak hozzáadjuk a mennyiséget
          const existing = groupedAssets.get(sym);
          existing.amount += item.amount;
          existing.value += item.value; // Az eredeti vásárlási értéket is összeadjuk
          
          // Eltesszük az ID-ját is, hogy törlésnél megtaláljuk!
          existing.firebaseIds.push(item.id);
        } else {
          // Ha még nincs, létrehozzuk, és kap egy új listát a Firebase ID-knak
          groupedAssets.set(sym, { ...item, firebaseIds: [item.id] });
        }
      }
      
      // Visszaalakítjuk a Map-et egy sima tömbbé
      const aggregatedDbData = Array.from(groupedAssets.values());

      // 2. ÉLŐ ÁRAK LETÖLTÉSE (Védőhálóval)
      let liveCoins: any[] = [];
      try {
        liveCoins = await firstValueFrom(this.cryptoApi.getTopCoins());
      } catch (apiError) {
        console.warn('Élő árak letöltése sikertelen. Maradnak a mentett árak.');
      }

      let newTotal = 0;

      // 3. PÁROSÍTÁS AZ ÉLŐ ÁRAKKAL
      const updatedData = aggregatedDbData.map(item => {
        const liveCoin = liveCoins.find(c => c.symbol.toLowerCase() === item.symbol.toLowerCase());
        const liveValue = liveCoin ? (item.amount * liveCoin.current_price) : item.value;

        newTotal += liveValue;

        return {
          ...item,
          value: liveValue 
        };
      });
      
      this.dataSource = [...updatedData];
      this.totalBalance = newTotal;
      this.cdr.detectChanges(); 
      
    } catch (error) {
      console.error('Kritikus hiba a portfólió betöltésekor:', error);
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

  async deleteItem(element: any) {
    if (window.confirm(`Biztosan törlöd az összes ${element.name} tételt a portfóliódból?`)) {
      try {
        // Végigmegyünk az összes belső Firebase ID-n, amit az összevonáskor eltettünk, és mindet töröljük
        for (const firebaseId of element.firebaseIds) {
          await this.portfolioService.deleteAsset(firebaseId);
        }
        this.refreshData(); // Újratöltjük az oldalt
      } catch (err) {
        console.error('Hiba a törlésnél:', err);
      }
    }
  }
}