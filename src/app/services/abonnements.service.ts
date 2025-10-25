import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ✅ Interface TypeScript pour représenter un abonnement
export interface Abonnement {
  id?: number;
  typeAbonnement: string;
  prix: number;
  dateDebut: string; // format YYYY-MM-DD
  dateFin: string;   // format YYYY-MM-DD
  statut: 'SUSPENDU' | 'ANNULE' | 'EXPIRE' | 'ACTIVE';
  modePaiement: 'COMPTE_BANCAIRE' | 'PAYPAL' | 'VIREMENT' | 'ESPECE';
  renouvellementAuto: boolean;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AbonnementsService {

  private apiUrl = 'http://localhost:9040/api/abonnements'; 

  constructor(private http: HttpClient) { }

  // 🔹 Récupérer tous les abonnements
  getAll(): Observable<Abonnement[]> {
    return this.http.get<Abonnement[]>(this.apiUrl);
  }

  // 🔹 Récupérer un abonnement par ID
  getById(id: number): Observable<Abonnement> {
    return this.http.get<Abonnement>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Créer un abonnement
  create(abonnement: Abonnement): Observable<Abonnement> {
    return this.http.post<Abonnement>(this.apiUrl, abonnement);
  }

  // 🔹 Mettre à jour un abonnement
  update(id: number, abonnement: Abonnement): Observable<Abonnement> {
    return this.http.put<Abonnement>(`${this.apiUrl}/${id}`, abonnement);
  }

  // 🔹 Supprimer un abonnement
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
