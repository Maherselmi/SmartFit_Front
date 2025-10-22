import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  private baseUrl = 'http://localhost:9090/api/signup';

  constructor(private http: HttpClient) {}

  registerCoach(coachData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/coach`, coachData);
  }

  registerClient(clientData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/client`, clientData);
  }
  registerAdmin(clientData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin`, clientData);
  }
}
