import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

// A Firebase Auth importjai a Google bejelentkezéshez
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  // Beemeljük az útválasztót és a hitelesítést
  private auth = inject(Auth);
  private router = inject(Router);

  // Ez a függvény fut le a gombra kattintva
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      // Megnyitja a felugró ablakot
      const result = await signInWithPopup(this.auth, provider);
      
      console.log('Sikeres belépés:', result.user.displayName);
      // Ha sikerült, átirányítjuk a főoldalra
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Hiba a bejelentkezés során:', error);
    }
  }
}