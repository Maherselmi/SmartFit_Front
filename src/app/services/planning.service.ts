// src/app/services/planning.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Planning} from "../Models/Planning";

@Injectable({
  providedIn: 'root'
})
export class PlanningService {

  private baseUrl = 'http://localhost:9090/api/plannings/all';

  constructor(private http: HttpClient) { }

  // Cette méthode doit absolument exister
  getPlannings(): Observable<Planning[]> {
    return this.http.get<Planning[]>(this.baseUrl);
  }
}
