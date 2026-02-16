import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
<<<<<<< HEAD
  private readonly apiUrl = 'http://localhost:5009'; // URL de ton Flask backend
=======
  private readonly apiUrl = 'http://localhost:5000'; // URL de ton Flask backend
>>>>>>> 2eb60c76dd666b104ac0c3a54a2fa01bcd4b3999

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/questions`);
  }

  predict(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/predict`, data);
  }
}
