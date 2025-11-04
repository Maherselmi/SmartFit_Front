import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatResponse, RecommendationResponse } from '../Models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // ✅ Adresse de ton backend Flask pour le chat personnalisé
  private chatApiUrl = 'http://127.0.0.1:5000/chat';

  // ✅ Adresse de ton backend Flask pour start-chat & answer
  private apiUrl = 'http://127.0.0.1:5000/api';

  constructor(private http: HttpClient) {}

  /**
   * Chat simple (message + nom client)
   */
  sendMessage(message: string, clientName: string): Observable<any> {
    const payload = {
      message: message,
      client_name: clientName
    };

    console.log('📤 Envoi au backend:', payload);

    return this.http.post<any>(this.chatApiUrl, payload);
  }

  /**
   * Démarrer une session chat (optionnel userId)
   */
  startChat(userId?: string): Observable<ChatResponse> {
    const body = userId ? { user_id: userId } : {};
    return this.http.post<ChatResponse>(`${this.apiUrl}/start-chat`, body);
  }

  /**
   * Envoyer une réponse utilisateur à l’API recommandation
   */
  sendAnswer(userId: string, answer: string): Observable<ChatResponse | RecommendationResponse> {
    return this.http.post<ChatResponse | RecommendationResponse>(`${this.apiUrl}/answer`, {
      user_id: userId,
      answer: answer
    });
  }
}
