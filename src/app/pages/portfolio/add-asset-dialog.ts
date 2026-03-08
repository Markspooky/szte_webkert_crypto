import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

// ÚJ IMPORTOK: A lenyíló listához és az API-hoz
import { MatSelectModule } from '@angular/material/select';
import { CryptoApiService, CoinData } from '../../services/crypto-api.service';

@Component({
  selector: 'app-add-asset-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, 
    MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>Új tranzakció rögzítése</h2>
    <mat-dialog-content>
      <form [formGroup]="assetForm" class="dialog-form">
        
        <mat-form-field appearance="outline">
          <mat-label>Válassz kriptovalutát</mat-label>
          <mat-select formControlName="coinId" (selectionChange)="onCoinSelect($event.value)">
            <mat-option *ngFor="let coin of availableCoins" [value]="coin.id">
              <img [src]="coin.image" class="dropdown-logo">
              {{ coin.name }} ({{ coin.symbol | uppercase }}) - {{ coin.current_price | currency:'USD' }}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Mennyiség (db)</mat-label>
          <input matInput type="number" formControlName="amount" placeholder="pl. 0.5" required>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Teljes Érték (USD)</mat-label>
          <input matInput type="number" formControlName="value" readonly>
          <mat-hint>Automatikusan számolva az élő ár alapján</mat-hint>
        </mat-form-field>

      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Mégse</button>
      <button mat-raised-button color="primary" [disabled]="assetForm.invalid" (click)="save()">Mentés</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 15px;
      margin-top: 15px;
      min-width: 300px;
    }
    .dropdown-logo {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 10px;
    }
  `]
})
export class AddAssetDialog implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddAssetDialog>);
  private data = inject(MAT_DIALOG_DATA, { optional: true });
  
  // Beinjektáljuk az API szolgáltatást, hogy elérjük az árakat
  private cryptoApi = inject(CryptoApiService);

  availableCoins: CoinData[] = [];
  selectedCoinPrice: number = 0;

  // Az űrlap definíciója. A 'value' mező "disabled", azaz a felhasználó nem írhatja át!
  assetForm: FormGroup = this.fb.group({
    coinId: ['', Validators.required],
    name: ['', Validators.required],
    symbol: ['', Validators.required],
    amount: [null, [Validators.required, Validators.min(0.00001)]],
    value: [{value: null, disabled: true}, Validators.required] 
  });

  ngOnInit() {
    // 1. Amikor megnyílik az ablak, letöltjük a kriptókat a lenyíló listába
    this.cryptoApi.getTopCoins().subscribe(coins => {
      this.availableCoins = coins;

      // Ha a Főoldal kosár gombjával jöttünk, automatikusan kiválasztjuk a listából!
      if (this.data && this.data.name) {
        const matchedCoin = coins.find(c => c.name === this.data.name);
        if (matchedCoin) {
          this.assetForm.patchValue({ coinId: matchedCoin.id });
          this.onCoinSelect(matchedCoin.id);
        }
      }
    });

    // 2. Figyeljük a "Mennyiség" mezőt. Ha a felhasználó gépel, azonnal számolunk!
    this.assetForm.get('amount')?.valueChanges.subscribe(amount => {
      this.calculateTotal(amount);
    });
  }

  // Ha a felhasználó új kriptót választ a listából
  onCoinSelect(coinId: string) {
    const coin = this.availableCoins.find(c => c.id === coinId);
    if (coin) {
      this.selectedCoinPrice = coin.current_price;
      
      // A háttérben beállítjuk a nevét és a szimbólumát az adatbázis számára
      this.assetForm.patchValue({
        name: coin.name,
        symbol: coin.symbol.toUpperCase()
      });
      
      // Újraszámoljuk az értéket az új érme árával
      this.calculateTotal(this.assetForm.get('amount')?.value);
    }
  }

  // A matematikai varázslat
  calculateTotal(amount: number) {
    if (amount && this.selectedCoinPrice > 0) {
      const total = amount * this.selectedCoinPrice;
      this.assetForm.patchValue({ value: total });
    } else {
      this.assetForm.patchValue({ value: null });
    }
  }

  save() {
    if (this.assetForm.valid) {
      // Mivel a 'value' mező le van tiltva (readonly), a sima .value nem adná vissza.
      // Ezért a getRawValue()-t használjuk, ami minden adatot kinyer az űrlapból.
      const finalData = this.assetForm.getRawValue();
      this.dialogRef.close(finalData);
    }
  }
}