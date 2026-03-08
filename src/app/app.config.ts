import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Firebase importok a hivatalos csomagból
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';



// !!! IDE MÁSOLD BE A SAJÁT KÓDODAT A FIREBASE CONSOLE-BÓL !!!
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
    // Firebase szolgáltatások regisztrálása
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};