import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
export interface MyAsset {
  name: string;
  symbol: string;
  amount: number;
  value: number;
}

const MOCK_PORTFOLIO: MyAsset[] = [
  { name: 'Bitcoin', symbol: 'BTC', amount: 0.15, value: 9814.81 },
  { name: 'Ethereum', symbol: 'ETH', amount: 2.4, value: 8296.27 },
  { name: 'Solana', symbol: 'SOL', amount: 45, value: 6534.00 }
];

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss'
})
export class Portfolio {
  // Lekérjük a Firebase hitelesítést
  private auth = inject(Auth);
  // Létrehozunk egy folyamatosan frissülő változót a felhasználó állapotáról
  user$ = authState(this.auth);

  displayedColumns: string[] = ['asset', 'amount', 'value', 'actions'];
  dataSource = MOCK_PORTFOLIO;
  totalBalance = 24645.08;
}

