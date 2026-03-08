import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

// Létrehozunk egy típust, hogy az Angular tudja, mik ezek az adatok
export interface Coin {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
}

// A statikus "kamu" adataink az 1. mérföldkőhöz
const MOCK_COINS: Coin[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 65432.10, change24h: 2.5 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3456.78, change24h: -1.2 },
  { id: 'solana', name: 'Solana', symbol: 'SOL', price: 145.20, change24h: 5.6 },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.45, change24h: 0.8 },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', price: 6.78, change24h: -0.5 }
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  // Megmondjuk a táblázatnak, milyen oszlopokat mutasson
  displayedColumns: string[] = ['name', 'price', 'change', 'action'];
  // Átadjuk neki az adatokat
  dataSource = MOCK_COINS;
}