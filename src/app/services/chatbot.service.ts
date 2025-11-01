import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private readonly apiUrl = 'http://localhost:5000'; // URL de ton Flask backend

  constructor(private http: HttpClient) {}

  getQuestions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/questions`);
  }

  predict(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/predict`, data);
  }
}
