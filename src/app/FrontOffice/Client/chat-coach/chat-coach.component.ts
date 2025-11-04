import { Component, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  from: 'user' | 'bot';
  text: string;
  time: string;
  typing?: boolean;
}

@Component({
  selector: 'app-chat-coach',
  templateUrl: './chat-coach.component.html',
  styleUrls: ['./chat-coach.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ChatCoachComponent implements AfterViewChecked {
  @ViewChild('chatBox') private chatBox!: ElementRef;

  userMessage: string = '';
  messages: Message[] = [];
  loading: boolean = false;

  apiChat = 'http://127.0.0.1:5000/api/chat_coach';

  constructor(private http: HttpClient) {}

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    const text = this.userMessage.trim();
    if (!text) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.messages.push({ from: 'user', text, time: timestamp });
    this.userMessage = '';
    this.loading = true;

    // Animation "typing" pour le bot
    this.messages.push({ from: 'bot', text: '', time: '', typing: true });

    this.http.post<any>(this.apiChat, { message: text }).subscribe({
      next: (res) => {
        const botText = res?.reply || "Désolé, je n'ai pas compris.";
        const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const typingIndex = this.messages.findIndex(m => m.typing);
        if (typingIndex > -1) this.messages.splice(typingIndex, 1);

        this.messages.push({ from: 'bot', text: botText, time: botTime });
        this.loading = false;
      },
      error: () => {
        const errTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const typingIndex = this.messages.findIndex(m => m.typing);
        if (typingIndex > -1) this.messages.splice(typingIndex, 1);

        this.messages.push({ from: 'bot', text: '❌ Erreur du coach.', time: errTime });
        this.loading = false;
      }
    });
  }
  isOpen = false;

  toggleChat() {
    this.isOpen = !this.isOpen;
  }
  formatBotText(text: string): string {
    if (!text) return '';

    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // support du gras
      .replace(/\n/g, '<br>')                            // sauts de ligne
      .replace(/(\b[0-9]+ ?(kg|cal|km|min)\b)/gi, '<span class="highlight">$1</span>'); // mise en valeur unités

    // Ajout d’emojis contextuels
    if (/motivation/i.test(formatted)) formatted = "💪 " + formatted;
    if (/nutrition/i.test(formatted)) formatted = "🥗 " + formatted;
    if (/entraînement/i.test(formatted)) formatted = "🏋️ " + formatted;
    if (/repos|sommeil/i.test(formatted)) formatted = "😴 " + formatted;

    return formatted;
  }

  private scrollToBottom(): void {
    try {
      if (this.chatBox) {
        const el = this.chatBox.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }
}
