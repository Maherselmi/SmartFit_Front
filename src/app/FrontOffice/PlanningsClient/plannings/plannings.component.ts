// src/app/components/plannings/plannings.component.ts
import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { Planning } from "../../../Models/Planning";
import { PlanningService } from "../../../services/planning.service";
import { ChatService } from "../../../services/chat.service";

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

@Component({
  selector: 'app-plannings',
  templateUrl: './plannings.component.html',
  styleUrls: ['./plannings.component.css']
})
export class PlanningsComponent implements OnInit, AfterViewChecked {

  plannings: Planning[] = [];
  currentWeekStart: Date = new Date();
  timeSlots: string[] = [];
  daysOfWeek: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  // Variables pour le chatbot
  messages: Message[] = [];
  userMessage: string = '';
  clientName: string = 'Lamia';
  isChatbotVisible: boolean = false;
  isChatbotMinimized: boolean = false;
  unreadMessages: number = 0;

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  // Mapping des titres vers les types de cours
  private courseTypeMapping: { [key: string]: string } = {
    'Yoga Session': 'YOGA',
    'Pilates Class': 'PILATES',
    'Fitness Training': 'FITNESS',
    'Spinning Class': 'SPINNING',
    'Cardio Workout': 'CARDIO',
    'Musculation': 'MUSCULATION'
  };

  constructor(
    private planningService: PlanningService,
    private chatService: ChatService
  ) {
    this.generateTimeSlots();
    this.initializeCurrentWeek();
    this.addWelcomeMessage();
  }

  ngOnInit(): void {
    this.loadPlannings();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  // === MÉTHODES CORRIGÉES DU CHATBOT ===
  addWelcomeMessage(): void {
    const welcomeMessage: Message = {
      text: '👋 Bonjour ! Je suis votre assistant SportFit. Je peux vous aider à :\n\n• 👨‍🏫 Trouver un coach\n• 🏋️ Réserver des séances\n \n\n',
      sender: 'bot'
    };
    this.messages.push(welcomeMessage);
  }

  sendMessage(): void {
    const message = this.userMessage.trim();
    if (!message) return;

    // Ajouter le message de l'utilisateur
    this.messages.push({ text: message, sender: 'user' });
    this.userMessage = '';

    // Si le chatbot est minimisé, incrémenter les messages non lus
    if (this.isChatbotMinimized || !this.isChatbotVisible) {
      this.unreadMessages++;
    }

    // Appel au service chat
    this.chatService.sendMessage(message, this.clientName).subscribe({
      next: (res) => {
        console.log('✅ Réponse du serveur :', res);

        if (res.reply) {
          let replyText = '';

          // Cas 1 : Recherche de coachs
          if (res.reply.type === 'recherche_coach') {
            if (res.reply.coachs && res.reply.coachs.length > 0) {
              replyText = `${res.reply.message}\n\n`;
              res.reply.coachs.forEach((coach: any) => {
                replyText += `👟 ${coach.nom} (${coach.specialite}) - 📞 ${coach.telephone}\n`;
              });
              replyText += `\n💡 Pour réserver avec l'un de ces coachs, dites-moi lequel vous intéresse !`;
            } else {
              replyText = res.reply.message || 'Aucun coach trouvé pour vos critères.';
            }
          }
          // Cas 2 : Réservation détectée par l'IA
          else if (res.reply.coach) {
            const coach = res.reply.coach ?? 'Non spécifié';
            const jour = res.reply.jour ?? 'Non spécifié';
            const heureDebut = res.reply.heure_debut ?? '?';
            const heureFin = res.reply.heure_fin ?? '?';
            const titre = res.reply.titre ?? 'Séance';

            replyText = `✅ Réservation enregistrée !\n\n📋 Détails :\n• Activité : ${titre}\n• Coach : ${coach}\n• Date : ${jour}\n• Horaire : ${heureDebut} - ${heureFin}\n\n🎯 Votre séance est confirmée !`;
          }
          // Cas 3 : Réponse standard
          else {
            replyText = res.reply.message || '🤖 Je n\'ai pas compris votre demande. Pouvez-vous reformuler ?';
          }

          this.messages.push({ text: replyText, sender: 'bot' });
        } else {
          this.messages.push({
            text: '🤖 Je rencontre un problème technique. Veuillez réessayer dans quelques instants.',
            sender: 'bot'
          });
        }
      },
      error: (err) => {
        console.error('❌ Erreur serveur :', err);
        const errorMessages = [
          '🤖 Je suis temporairement indisponible. Veuillez réessayer plus tard.',
          '📡 Problème de connexion. Vérifiez votre internet et réessayez.',
          '🔄 Service momentanément interrompu. Je serai de retour rapidement !'
        ];
        const randomError = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        this.messages.push({ text: randomError, sender: 'bot' });
      }
    });
  }

  toggleChatbot(): void {
    this.isChatbotVisible = !this.isChatbotVisible;
    if (this.isChatbotVisible) {
      this.isChatbotMinimized = false;
      this.unreadMessages = 0;
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  minimizeChatbot(): void {
    this.isChatbotMinimized = true;
  }

  maximizeChatbot(): void {
    this.isChatbotMinimized = false;
    this.unreadMessages = 0;
    setTimeout(() => this.scrollToBottom(), 100);
  }

  quickAction(action: string): void {
    const quickMessages: { [key: string]: string } = {
      'planning': 'Quel planning voulez-vous voir ? Cette semaine ou la semaine prochaine ?',
      'coach': 'Je cherche un coach pour vous. Quelle spécialité vous intéresse ?',
      'reservation': 'Super ! Pour quelle activité souhaitez-vous réserver ?',
      'help': 'Je peux vous aider avec les plannings, les coachs et les réservations. Que souhaitez-vous ?'
    };

    this.userMessage = action;
    this.sendMessage();
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Erreur lors du scroll:', err);
    }
  }

  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // === MÉTHODES DU PLANNING ===
  generateTimeSlots(): void {
    for (let hour = 6; hour <= 20; hour++) {
      this.timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
  }

  loadPlannings(): void {
    this.planningService.getPlannings().subscribe({
      next: (data: Planning[]) => {
        this.plannings = data;
        console.log('Plannings chargés:', this.plannings);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des plannings:', error);
      }
    });
  }

  getEventsForDayAndTime(dayIndex: number, timeSlot: string): Planning[] {
    const targetDate = this.getDateForDayIndex(dayIndex);
    const targetTime = timeSlot;

    return this.plannings.filter(planning => {
      const planningDate = new Date(planning.dateDebut);
      const planningTime = planningDate.toTimeString().substring(0, 5);
      const planningDay = planningDate.getDay();

      const adjustedPlanningDay = planningDay === 0 ? 6 : planningDay - 1;

      return adjustedPlanningDay === dayIndex && planningTime === targetTime;
    });
  }

  getDateForDayIndex(dayIndex: number): Date {
    const date = new Date(this.currentWeekStart);
    date.setDate(this.currentWeekStart.getDate() + dayIndex);
    return date;
  }

  getCurrentWeekDisplay(): string {
    const start = new Date(this.currentWeekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    const startStr = start.toLocaleDateString('fr-FR', options);
    const endStr = end.toLocaleDateString('fr-FR', options);

    return `Semaine du ${startStr} au ${endStr}`;
  }

  previousWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.currentWeekStart = new Date(this.currentWeekStart);
  }

  nextWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.currentWeekStart = new Date(this.currentWeekStart);
  }

  hasEventsForCurrentWeek(): boolean {
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      for (let timeSlot of this.timeSlots) {
        const events = this.getEventsForDayAndTime(dayIndex, timeSlot);
        if (events.length > 0) {
          return true;
        }
      }
    }
    return false;
  }

  getCourseType(planning: Planning): string {
    const title = planning.titre?.toUpperCase() || '';

    for (const [key, value] of Object.entries(this.courseTypeMapping)) {
      if (title.includes(key.toUpperCase())) {
        return value;
      }
    }

    if (title.includes('YOGA')) return 'YOGA';
    if (title.includes('PILATES')) return 'PILATES';
    if (title.includes('SPINNING') || title.includes('CYCLING')) return 'SPINNING';
    if (title.includes('CARDIO')) return 'CARDIO';
    if (title.includes('MUSCULATION') || title.includes('STRENGTH')) return 'MUSCULATION';
    if (title.includes('FITNESS') || title.includes('TRAINING')) return 'FITNESS';

    return 'FITNESS';
  }

  getEventColor(planning: Planning): string {
    const courseType = this.getCourseType(planning);

    const colors: { [key: string]: string } = {
      'YOGA': 'yoga',
      'PILATES': 'pilates',
      'FITNESS': 'fitness',
      'SPINNING': 'spinning',
      'CARDIO': 'cardio',
      'MUSCULATION': 'musculation'
    };

    return colors[courseType] || 'fitness';
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toTimeString().substring(0, 5);
  }

  getEventDuration(dateDebut: string, dateFin: string): string {
    const start = new Date(dateDebut);
    const end = new Date(dateFin);
    const startTime = start.toTimeString().substring(0, 5);
    const endTime = end.toTimeString().substring(0, 5);
    return `${startTime} - ${endTime}`;
  }

  getCoachName(planning: Planning): string {
    return `Coach ${planning.coachId}`;
  }

  onEventClick(planning: Planning): void {
    alert(`Vous avez sélectionné:\n${planning.titre}\n${this.getEventDuration(planning.dateDebut, planning.dateFin)}\nAvec ${this.getCoachName(planning)}\n\nFonctionnalité de réservation à implémenter.`);
  }

  initializeCurrentWeek(): void {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    this.currentWeekStart = new Date(today.setDate(diff));
  }
}
