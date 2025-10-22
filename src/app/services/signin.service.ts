import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:9090/api/auth'; // correspond à ton @RequestMapping("/api/auth")

  constructor(private http: HttpClient) {}

  loginCoach(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/coach`, credentials);
  }

  loginClient(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/client`, credentials);
  }

  loginAdmin(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/admin`, credentials);
  }
}
