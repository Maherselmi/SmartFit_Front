// src/app/services/planning.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Planning} from "../Models/Planning";

@Injectable({
  providedIn: 'root'
})
export class PlanningService {

<<<<<<< HEAD
  private baseUrl = 'http://localhost:9090/api/plannings/all';
=======
  private baseUrl = 'http://localhost:9040/api/plannings/all';
>>>>>>> 4c7b750 (Added Subscription Module (backoffice))

  constructor(private http: HttpClient) { }

  // Cette méthode doit absolument exister
  getPlannings(): Observable<Planning[]> {
    return this.http.get<Planning[]>(this.baseUrl);
  }
}
