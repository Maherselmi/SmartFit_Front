import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  messages: Message[] = [];
  userMessage: string = '';
  clientName: string = 'Lamia'; // à remplacer par le vrai nom du client connecté

  constructor(private chatService: ChatService) {}

  sendMessage() {
    const message = this.userMessage.trim();
    if (!message) return;

    // 🔹 Ajouter le message de l'utilisateur
    this.messages.push({ text: message, sender: 'user' });

    // 🔹 Appel au backend Flask
    this.chatService.sendMessage(message, this.clientName).subscribe({
      next: (res) => {
        console.log('✅ Réponse du serveur :', res);

        if (res.reply) {
          let replyText = '';

          // 🔹 Cas 1 : Recherche de coachs
          if (res.reply.type === 'recherche_coach') {
            if (res.reply.coachs && res.reply.coachs.length > 0) {
              replyText = `${res.reply.message}\n\n`;
              res.reply.coachs.forEach((coach: any) => {
                replyText += `👟 ${coach.nom} (${coach.specialite}) - 📞 ${coach.telephone}\n`;
              });
            } else {
              replyText = res.reply.message || 'Aucun coach trouvé.';
            }
          }
          // 🔹 Cas 2 : Réservation détectée par l’IA
          else if (res.reply.coach) {
            const coach = res.reply.coach ?? 'Non spécifié';
            const jour = res.reply.jour ?? 'Non spécifié';
            const heureDebut = res.reply.heure_debut ?? '?';
            const heureFin = res.reply.heure_fin ?? '?';
            const titre = res.reply.titre ?? 'Séance';

            replyText = `✅ Réservation enregistrée :\nCoach : ${coach}\nJour : ${jour}\nHeure : ${heureDebut} - ${heureFin}\nTitre : ${titre}`;
          }
          // 🔹 Cas 3 : Erreur ou autre
          else {
            replyText = '🤖 Je n’ai pas compris votre demande.';
          }

          this.messages.push({ text: replyText, sender: 'bot' });
        } else {
          this.messages.push({ text: 'Erreur dans la réponse du bot 🤖', sender: 'bot' });
        }
      },
      error: (err) => {
        console.error('❌ Erreur serveur :', err);
        this.messages.push({ text: 'Erreur de connexion au serveur Flask ⚠️', sender: 'bot' });
      }
    });

    this.userMessage = '';
  }
}
