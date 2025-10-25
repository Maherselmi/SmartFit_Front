import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // ✅ Adresse de ton backend Flask
  private apiUrl = 'http://127.0.0.1:5000/chat';

  constructor(private http: HttpClient) {}

  /**
   * Envoie un message au backend Flask et reçoit la réponse du chatbot
   * @param message Le message saisi par l'utilisateur
   * @param clientName Le nom du client connecté (ex: "Lamia")
   */
  sendMessage(message: string, clientName: string): Observable<any> {
    const payload = {
      message: message,
      client_name: clientName
    };

    console.log('📤 Envoi au backend:', payload); // Debug console

    return this.http.post<any>(this.apiUrl, payload);
  }
}
