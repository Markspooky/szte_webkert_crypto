import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Auth, authState, signOut } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatSlideToggleModule, MatSelectModule, 
    MatFormFieldModule, MatIconModule, MatButtonModule, RouterModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  private auth = inject(Auth);
  private router = inject(Router);
  user$ = authState(this.auth);

  // Változó a kapcsoló állapotának tárolására
  isDarkMode = false;

  // Ez a függvény akkor fut le, amikor betöltődik a Profil oldal
  ngOnInit() {
    // Megnézzük, hogy a böngésző memóriájában sötét mód van-e elmentve
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || document.body.classList.contains('dark-theme')) {
      this.isDarkMode = true;
    }
  }

  // Ez a függvény fut le, amikor rákattintasz a kapcsolóra
  toggleDarkMode(event: any) {
    this.isDarkMode = event.checked;
    
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark'); // Elmentjük a memóriába
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  async logout() {
    const isConfirmed = window.confirm('Biztosan ki szeretnél jelentkezni?');
    if (isConfirmed) {
      // 1. Sötét mód kikapcsolása vizuálisan
      document.body.classList.remove('dark-theme');
      // 2. Böngésző memóriájának visszaállítása világosra
      localStorage.setItem('theme', 'light');
      // 3. A csúszka változójának visszaállítása
      this.isDarkMode = false;

      // Kijelentkeztetés és átirányítás
      await signOut(this.auth);
      this.router.navigate(['/home']);
    }
  }
}