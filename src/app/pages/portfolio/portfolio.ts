import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss'
})
export class Portfolio {
  displayedColumns: string[] = ['asset', 'amount', 'value', 'actions'];
  dataSource = MOCK_PORTFOLIO;
  totalBalance = 24645.08; // Statikus összesített érték
}