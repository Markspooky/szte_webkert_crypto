import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { Portfolio } from './pages/portfolio/portfolio';
import { Profile } from './pages/profile/profile';
import { CoinDetails } from './pages/coin-details/coin-details';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'portfolio', component: Portfolio },
  { path: 'profile', component: Profile },
  { path: 'coin/:id', component: CoinDetails },
  { path: '**', redirectTo: 'home' }
];