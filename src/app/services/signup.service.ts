import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

<<<<<<< HEAD
  private baseUrl = 'http://localhost:9090/api/signup';
=======
  private baseUrl = 'http://localhost:9040/api/signup';
>>>>>>> 4c7b750 (Added Subscription Module (backoffice))

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
