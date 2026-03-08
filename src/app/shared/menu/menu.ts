import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Angular Material importok
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

// Firebase Auth importok
import { Auth, authState, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule, // Ez kell az async pipe-hoz
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu {
  private auth = inject(Auth);
  private router = inject(Router);
  
  // Ebből tudja a HTML, hogy be vagyunk-e jelentkezve
  user$ = authState(this.auth);

  // Kijelentkezés gomb logika a menüben
  // Frissített kijelentkezés logika felugró ablakkal
  async logout() {
    const isConfirmed = window.confirm('Biztosan ki szeretnél jelentkezni?');
    
    if (isConfirmed) {
      // Sötét mód kikapcsolása és memória visszaállítása
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');

      await signOut(this.auth);
      this.router.navigate(['/home']);
    }
  }
}