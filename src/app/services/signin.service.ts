import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
<<<<<<< HEAD
  private baseUrl = 'http://localhost:9090/api/auth'; // correspond à ton @RequestMapping("/api/auth")
=======
  private baseUrl = 'http://localhost:9040/api/auth'; // correspond à ton @RequestMapping("/api/auth")
>>>>>>> 4c7b750 (Added Subscription Module (backoffice))

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
