import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-coin-details',
  standalone: true,
  // Beimportáljuk a kártyákat, gombokat és az útválasztót
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './coin-details.html',
  styleUrl: './coin-details.scss'
})
export class CoinDetails {
  coinId: string | null = '';

  // Az ActivatedRoute segít kiolvasni az URL-ből a coin nevét (pl. bitcoin)
  constructor(private route: ActivatedRoute) {
    this.coinId = this.route.snapshot.paramMap.get('id');
  }
}