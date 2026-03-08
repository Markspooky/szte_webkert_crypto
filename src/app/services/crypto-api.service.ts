import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Így néz ki egy kriptovaluta adata, amit a CoinGecko visszaküld nekünk
export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string; // Ez a logó URL-je!
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

@Injectable({
  providedIn: 'root'
})
export class CryptoApiService {
  // Beinjektáljuk az Angular postását
  private http = inject(HttpClient);
  
  // A CoinGecko ingyenes API végpontja
  private apiUrl = 'https://api.coingecko.com/api/v3';

  // Lekérjük a top 10 kriptovalutát piaci kapitalizáció alapján, USD-ben
  getTopCoins(): Observable<CoinData[]> {
    const url = `${this.apiUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`;
    return this.http.get<CoinData[]>(url);
  }
  
  getCoinHistory(coinId: string, days: number = 7): Observable<any> {
    const url = `${this.apiUrl}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`;
    return this.http.get(url);
  }
}