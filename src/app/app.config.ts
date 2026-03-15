import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyBwckOJ_r-o6aPKpCOJA9AybTuTCBAnQXw",
  authDomain: "cryptotracker-szte.firebaseapp.com",
  projectId: "cryptotracker-szte",
  storageBucket: "cryptotracker-szte.firebasestorage.app",
  messagingSenderId: "116299782310",
  appId: "1:116299782310:web:bc06081b234bfaa3d17c67",
  measurementId: "G-EH6717KB2F"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};