import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, onSnapshot,getDocs } from '@angular/fire/firestore';

import { Subject } from 'rxjs';

export interface CryptoAsset {
  id?: string;
  name: string;
  symbol: string;
  amount: number;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private firestore = inject(Firestore);

getPortfolioLive(callback: (data: any[]) => void) {
    const portfolioCollection = collection(this.firestore, 'portfolio');
    
    // Ez a Firebase saját "figyelője", ami azonnal küld adatot, ha változás van
    return onSnapshot(portfolioCollection, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(data);
    });
  }

// src/app/services/portfolio.service.ts
async getPortfolioOnce(): Promise<CryptoAsset[]> {
  const portfolioCollection = collection(this.firestore, 'portfolio');
  const snapshot = await getDocs(portfolioCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as CryptoAsset[];
}

  // 2. LÉTREHOZÁS
addAsset(asset: any) {
    const portfolioCollection = collection(this.firestore, 'portfolio');
    return addDoc(portfolioCollection, asset);
  }

  deleteAsset(id: string) {
    const assetDoc = doc(this.firestore, `portfolio/${id}`);
    return deleteDoc(assetDoc);
  }
}