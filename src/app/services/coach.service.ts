import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coach } from '../Models/Coach';

@Injectable({
  providedIn: 'root'
})
export class CoachService {

  private apiUrl = 'http://localhost:9090/api/coachs'; // backend Spring Boot
  private aiUrl = 'http://localhost:5002/api/ai'; // backend Flask (IA)
  private planningUrl = 'http://localhost:5002/api/plannings'; // ✅ URL corrigée pour les plannings

  constructor(private http: HttpClient) { }

  // ======== CRUD Coach (Spring Boot) ========

  getAllCoachs(): Observable<Coach[]> {
    return this.http.get<Coach[]>(this.apiUrl);
  }

  getCoachById(id: number): Observable<Coach> {
    return this.http.get<Coach>(`${this.apiUrl}/${id}`);
  }

  createCoach(coach: Coach): Observable<Coach> {
    return this.http.post<Coach>(this.apiUrl, coach);
  }

  updateCoach(id: number, coach: Coach): Observable<Coach> {
    return this.http.put<Coach>(`${this.apiUrl}/${id}`, coach);
  }

  deleteCoach(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ======== Planning (Flask) ========

  /** 🔹 Récupérer le planning pour un coach spécifique */
  getCoachPlanning(coachId: number): Observable<any> {
    return this.http.get<any>(`${this.planningUrl}/${coachId}`); // ✅ URL corrigée
  }

  /** 🔹 Ajouter un planning */
  addPlanning(planningData: any): Observable<any> {
    return this.http.post<any>(this.planningUrl, planningData);
  }

  // ======== IA Flask ========

  /** 🔹 Génère un planning intelligent basé sur les coachs disponibles */
  getSmartPlanning(): Observable<any> {
    return this.http.get<any>(`${this.aiUrl}/generate_planning`);
  }

  /** 🔹 Prédit la performance selon le nombre de clients */
  predictPerformance(clientCount: number): Observable<any> {
    return this.http.post<any>(`${this.aiUrl}/predict_performance`, { client_count: clientCount });
  }
}
