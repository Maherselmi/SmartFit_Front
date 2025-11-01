import { Component, OnInit } from '@angular/core';
import { ChatbotService } from '../../services/chatbot.service';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  questions: any[] = [];
  currentQuestionIndex = 0;
  answers: any = {};
  messages: Message[] = [];
  predictionResult: string | null = null;
  userAnswer: string = '';

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions() {
    this.chatbotService.getQuestions().subscribe({
      next: (data) => {
        this.questions = data;
        if (this.questions.length > 0) {
          this.addBotMessage(this.questions[this.currentQuestionIndex].question);
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des questions:', err);
        this.addBotMessage('Désolé, je ne peux pas charger les questions pour le moment.');
      }
    });
  }

  sendAnswer() {
    const answer = this.userAnswer.trim();
    if (!answer) return;

    const currentQuestion = this.questions[this.currentQuestionIndex];

    // Conversion des types
    let formattedAnswer: any = answer;

    // Conversion automatique basée sur le type de question
    if (this.shouldConvertToNumber(currentQuestion.key)) {
      formattedAnswer = Number(answer);
      if (isNaN(formattedAnswer)) {
        this.addBotMessage("Veuillez entrer un nombre valide.");
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

    console.log(`✅ Réponse enregistrée: ${currentQuestion.key} =`, formattedAnswer);

    this.addUserMessage(answer);
    this.userAnswer = '';
    this.currentQuestionIndex++;

    if (this.currentQuestionIndex < this.questions.length) {
      setTimeout(() => {
        this.addBotMessage(this.questions[this.currentQuestionIndex].question);
      }, 500);
    } else {
      this.completeDataAndPredict();
    }
  }

  // Vérifie si le champ doit être numérique
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

  // Complète les données manquantes avant prédiction
  completeDataAndPredict() {
    this.addBotMessage("Calcul de votre score de forme...");

    // 🔥 CORRECTION : Fournir des valeurs par défaut pour tous les champs requis
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
      bmi: this.answers.bmi || 0, // Sera recalculé automatiquement
      resting_heart_rate: this.answers.resting_heart_rate || 70,
      blood_pressure_systolic: this.answers.blood_pressure_systolic || 120,
      blood_pressure_diastolic: this.answers.blood_pressure_diastolic || 80,
      health_condition: this.answers.health_condition || 0,
      smoking_status: this.answers.smoking_status || 0
    };

    console.log('📤 Données complètes envoyées:', completeData);

    this.chatbotService.predict(completeData).subscribe({
      next: (res) => {
        this.predictionResult = `${res.predicted_fitness_level} / 100`;
        this.addBotMessage(res.message);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la prédiction:', err);

        // Message d'erreur plus explicite
        let errorMessage = 'Désolé, une erreur est survenue lors du calcul de votre score.';

        if (err.includes('Champs manquants')) {
          errorMessage = 'Erreur: Certaines données nécessaires sont manquantes.';
        } else if (err.includes('Valeur invalide')) {
          errorMessage = 'Erreur: Une de vos réponses n\'est pas au bon format.';
        }

        this.addBotMessage(errorMessage);
        this.addBotMessage('Veuillez réessayer avec des valeurs numériques valides.');
      }
    });
  }

  addBotMessage(text: string) {
    this.messages.push({ text, sender: 'bot' });
    this.scrollToBottom();
  }

  addUserMessage(text: string) {
    this.messages.push({ text, sender: 'user' });
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      const messagesContainer = document.querySelector('.messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  }
}
