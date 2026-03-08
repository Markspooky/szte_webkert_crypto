import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

// Angular Material importok
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-menu',
  standalone: true,
  // Itt soroljuk fel, hogy miket használhat a HTML fájl:
  imports: [
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
export class Menu { }