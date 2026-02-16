import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatbotService } from '../../services/chatbot.service';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp?: string;
}

@Component({
  selector: 'app-fitness-progression',
  templateUrl: './fitness-progression.component.html',
  styleUrls: ['./fitness-progression.component.css']
})
export class FitnessProgressionComponent implements OnInit, AfterViewChecked {
  // Variables pour le chatbot
  questions: any[] = [];
  currentQuestionIndex = 0;
  answers: any = {};
  messages: Message[] = [];
  predictionResult: string | null = null;
  userAnswer: string = '';

  // État du chatbot
  isChatbotVisible: boolean = false;
  isChatbotMinimized: boolean = false;
  isTyping: boolean = false;
  unreadMessages: number = 0;

  // Variable pour l'année du footer
  currentYear: number = new Date().getFullYear();

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  constructor(private chatbotService: ChatbotService) { }

  ngOnInit(): void {
    this.initializeChatbot();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  // === INITIALISATION DU CHATBOT ===
  initializeChatbot() {
    // Message de bienvenue initial
    this.addBotMessage("👋 Bonjour ! Je suis votre assistant fitness personnel. Je vais vous aider à évaluer votre condition physique et vous donner des recommandations personnalisées.");
  }

  // === GESTION DE L'ÉTAT DU CHATBOT ===
  toggleChatbot() {
    this.isChatbotVisible = !this.isChatbotVisible;
    if (this.isChatbotVisible) {
      this.unreadMessages = 0;
    }
  }

  minimizeChatbot() {
    this.isChatbotMinimized = true;
  }

  maximizeChatbot() {
    this.isChatbotMinimized = false;
    this.unreadMessages = 0;
  }

  // === INTERACTIONS RAPIDES ===
  startFitnessEvaluation() {
    this.resetChatbot();
    this.loadQuestions();
    this.addBotMessage("🎯 Parfait ! Commençons l'évaluation de votre condition physique. Je vais vous poser quelques questions pour analyser votre forme.");
  }

  showTips() {
    this.addBotMessage("💪 **Conseils Fitness:**\n\n• Entraînez-vous 3-4 fois par semaine\n• Alternez cardio et musculation\n• Écoutez votre corps et reposez-vous\n• Hydratez-vous bien pendant l'exercice\n• Variez vos exercices pour progresser");
  }

  showNutritionTips() {
    this.addBotMessage("🍎 **Conseils Nutrition:**\n\n• Mangez des protéines à chaque repas\n• Privilégiez les glucides complexes\n• Buvez 2L d'eau par jour\n• Limitez les sucres ajoutés\n• Consommez des fruits et légumes variés");
  }

  // === LOGIQUE DU QUESTIONNAIRE ===
  loadQuestions() {
    this.chatbotService.getQuestions().subscribe({
      next: (data) => {
        this.questions = data;
        if (this.questions.length > 0) {
          setTimeout(() => {
            this.askQuestion(this.questions[this.currentQuestionIndex]);
          }, 1000);
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des questions:', err);
        this.addBotMessage('Désolé, je ne peux pas charger les questions pour le moment.');
      }
    });
  }

  askQuestion(question: any) {
    this.addBotMessage(question.question);
  }

  sendAnswer() {
    const answer = this.userAnswer.trim();
    if (!answer || this.isTyping) return;

    this.addUserMessage(answer);
    this.userAnswer = '';

    const currentQuestion = this.questions[this.currentQuestionIndex];
    let formattedAnswer: any = answer;

    // Conversion des types
    if (this.shouldConvertToNumber(currentQuestion.key)) {
      formattedAnswer = Number(answer);
      if (isNaN(formattedAnswer)) {
        this.addBotMessage("❌ Veuillez entrer un nombre valide.");
        return;
      }
    }

    // Conversion pour les champs booléens
    if (currentQuestion.key === 'gender' || currentQuestion.key === 'health_condition') {
      if (answer.toLowerCase() === 'homme' || answer.toLowerCase() === 'm') formattedAnswer = 0;
      else if (answer.toLowerCase() === 'femme' || answer.toLowerCase() === 'f') formattedAnswer = 1;
      else if (answer.toLowerCase() === 'oui') formattedAnswer = 1;
      else if (answer.toLowerCase() === 'non') formattedAnswer = 0;
    }

    this.answers[currentQuestion.key] = formattedAnswer;
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex < this.questions.length) {
      setTimeout(() => {
        this.askQuestion(this.questions[this.currentQuestionIndex]);
      }, 800);
    } else {
      this.completeDataAndPredict();
    }
  }

  // === PRÉDICTION ===
  completeDataAndPredict() {
    this.showTypingIndicator();

    setTimeout(() => {
      const completeData = {
        age: this.answers.age || 30,
        gender: this.answers.gender || 0,
        height_cm: this.answers.height_cm || 170,
        weight_kg: this.answers.weight_kg || 70,
        activity_type: this.answers.activity_type || 1,
        duration_minutes: this.answers.duration_minutes || 30,
        intensity: this.answers.intensity || 5,
        calories_burned: this.answers.calories_burned || 200,
        avg_heart_rate: this.answers.avg_heart_rate || 120,
        hours_sleep: this.answers.hours_sleep || 7,
        stress_level: this.answers.stress_level || 5,
        daily_steps: this.answers.daily_steps || 5000,
        hydration_level: this.answers.hydration_level || 1.5,
        bmi: this.answers.bmi || 0,
        resting_heart_rate: this.answers.resting_heart_rate || 70,
        blood_pressure_systolic: this.answers.blood_pressure_systolic || 120,
        blood_pressure_diastolic: this.answers.blood_pressure_diastolic || 80,
        health_condition: this.answers.health_condition || 0,
        smoking_status: this.answers.smoking_status || 0
      };

      this.chatbotService.predict(completeData).subscribe({
        next: (res) => {
          this.hideTypingIndicator();
          this.predictionResult = `${res.predicted_fitness_level} / 100`;

          // Message avec le score
          this.addBotMessage(`🎉 **Votre score de forme: ${res.predicted_fitness_level}/100**\n\n${res.message}`);

          // Recommandations supplémentaires
          setTimeout(() => {
            this.addBotMessage(this.getPersonalizedRecommendations(res.predicted_fitness_level));
          }, 1500);
        },
        error: (err) => {
          this.hideTypingIndicator();
          console.error('❌ Erreur lors de la prédiction:', err);
          this.addBotMessage("❌ Désolé, une erreur est survenue lors de l'analyse. Veuillez réessayer.");
        }
      });
    }, 2000);
  }

  // === MÉTHODES UTILITAIRES ===
  private shouldConvertToNumber(key: string): boolean {
    const numericFields = [
      'age', 'height_cm', 'weight_kg', 'activity_type', 'duration_minutes',
      'intensity', 'calories_burned', 'avg_heart_rate', 'hours_sleep',
      'stress_level', 'daily_steps', 'hydration_level', 'bmi',
      'resting_heart_rate', 'blood_pressure_systolic', 'blood_pressure_diastolic',
      'smoking_status'
    ];
    return numericFields.includes(key);
  }

  addBotMessage(text: string) {
    this.messages.push({
      text,
      sender: 'bot',
      timestamp: this.getCurrentTime()
    });
    if (!this.isChatbotVisible || this.isChatbotMinimized) {
      this.unreadMessages++;
    }
  }

  addUserMessage(text: string) {
    this.messages.push({
      text,
      sender: 'user',
      timestamp: this.getCurrentTime()
    });
  }

  showTypingIndicator() {
    this.isTyping = true;
  }

  hideTypingIndicator() {
    this.isTyping = false;
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getMessageCount(): string {
    const count = this.messages.length;
    return count === 1 ? '1 message' : `${count} messages`;
  }

  scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }

  resetChatbot() {
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.messages = [];
    this.predictionResult = null;
    this.userAnswer = '';
    this.isTyping = false;
  }

  getPersonalizedRecommendations(score: number): string {
    if (score < 40) {
      return `📋 **Plan d'action pour vous:**\n\n• Commencez par 20-30min de marche quotidienne\n• Intégrez 2 séances de renforcement musculaire par semaine\n• Travaillez votre souplesse avec des étirements\n• Consultez un professionnel de santé avant de commencer`;
    } else if (score < 70) {
      return `📋 **Plan d'action pour vous:**\n\n• Augmentez à 4-5 séances par semaine\n• Variez cardio et musculation\n• Essayez de nouveaux sports (natation, vélo)\n• Suivez votre progression avec un journal d'entraînement`;
    } else if (score < 85) {
      return `📋 **Plan d'action pour vous:**\n\n• Maintenez votre routine actuelle\n• Ajoutez des challenges (HIIT, course à pied)\n• Participez à des événements sportifs\n• Aidez d'autres personnes à se motiver`;
    } else {
      return `📋 **Plan d'action pour vous:**\n\n• Continuez votre excellente routine\n• Enseignez ou coachez si possible\n• Explorez des sports extrêmes ou compétitions\n• Devenez une source d'inspiration pour les autres`;
    }
  }
}
