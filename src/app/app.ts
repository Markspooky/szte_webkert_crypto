import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// 1. Ide importáljuk be a Menü osztályt a pontos elérési úttal
import { Menu } from './shared/menu/menu'; 

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. IDE kell betenni a Menu-t, hogy a HTML-ben felismerje az <app-menu> taget!
  imports: [RouterOutlet, Menu], 
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'crypto-tracker';
}