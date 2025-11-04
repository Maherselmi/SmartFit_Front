import { Component, OnInit } from '@angular/core';
import { ChatMessage } from 'src/app/Models/chat.model';
import {ChatService} from "../../services/chat.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  // État du chat
  currentQuestion: string = '';
  userAnswer: string = '';
  userId: string = '';
  questionIndex: number = 0;
  totalQuestions: number = 0;
  progress: number = 0;
  isCompleted: boolean = false;
  isLoading: boolean = false;

  // Historique des messages
  messages: ChatMessage[] = [];

  // Résultats
  recommendations: any[] = [];
  userProfile: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.startNewChat();
  }

  startNewChat() {
    this.isLoading = true;
    this.chatService.startChat().subscribe({
      next: (response) => {
        this.userId = response.user_id;
        this.currentQuestion = response.question;
        this.questionIndex = response.question_index;
        this.totalQuestions = response.total_questions;
        this.progress = 0;
        this.isCompleted = false;
        this.messages = [];
        this.recommendations = [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur démarrage chat:', error);
        this.isLoading = false;
      }
    });
  }

  sendAnswer() {
    if (!this.userAnswer.trim() || this.isLoading) return;

    this.isLoading = true;

    // Ajouter le message à l'historique
    this.messages.push({
      question: this.currentQuestion,
      answer: this.userAnswer,
      timestamp: new Date().toISOString()
    });

    const currentAnswer = this.userAnswer;
    this.userAnswer = '';

    this.chatService.sendAnswer(this.userId, currentAnswer).subscribe({
      next: (response: any) => {
        if (response.status === 'completed') {
          // Chat terminé
          this.isCompleted = true;
          this.recommendations = response.recommendations;
          this.userProfile = response.user_profile;
          this.progress = 100;
        } else {
          // Question suivante
          this.currentQuestion = response.question;
          this.questionIndex = response.question_index;
          this.progress = response.progress;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur envoi réponse:', error);
        this.isLoading = false;
      }
    });
  }

  restartChat() {
    this.startNewChat();
  }

  // Formatage des coachs pour l'affichage
  getCoachSpecialties(coach: any): string {
    return `${coach.primary_specialty}${coach.other_specialties ? `, ${coach.other_specialties}` : ''}`;
  }

  getAvailabilityText(score: number): string {
    return `${(score * 100)}% de disponibilité`;
  }
}
