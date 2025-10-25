// src/app/components/plannings/plannings.component.ts
import { Component, OnInit } from '@angular/core';
import {Planning} from "../../../Models/Planning";
import {PlanningService} from "../../../services/planning.service";


@Component({
  selector: 'app-plannings',
  templateUrl: './plannings.component.html',
  styleUrls: ['./plannings.component.css']
})
export class PlanningsComponent implements OnInit {

  plannings: Planning[] = [];
  currentWeekStart: Date = new Date();
  timeSlots: string[] = [];
  daysOfWeek: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  // Mapping des titres vers les types de cours
  private courseTypeMapping: { [key: string]: string } = {
    'Yoga Session': 'YOGA',
    'Pilates Class': 'PILATES',
    'Fitness Training': 'FITNESS',
    'Spinning Class': 'SPINNING',
    'Cardio Workout': 'CARDIO',
    'Musculation': 'MUSCULATION'
  };

  constructor(private planningService: PlanningService) {
    this.generateTimeSlots();
    this.initializeCurrentWeek();
  }

  ngOnInit(): void {
    this.loadPlannings();
  }

  generateTimeSlots(): void {
    // Générer les créneaux horaires de 6h à 20h
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

      // Ajuster l'index du jour (Lundi = 0 dans notre grille)
      const adjustedPlanningDay = planningDay === 0 ? 6 : planningDay - 1;

      return adjustedPlanningDay === dayIndex && planningTime === targetTime;
    });
  }

  getDateForDayIndex(dayIndex: number): Date {
    const date = new Date(this.currentWeekStart);
    // Lundi = dayIndex 0, donc on ajoute dayIndex jours
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
    this.currentWeekStart = new Date(this.currentWeekStart); // Trigger change detection
  }

  nextWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.currentWeekStart = new Date(this.currentWeekStart); // Trigger change detection
  }

  // Vérifier s'il y a des événements pour la semaine courante
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

  // Déduire le type de cours à partir du titre
  getCourseType(planning: Planning): string {
    const title = planning.titre?.toUpperCase() || '';

    // Vérifier le mapping défini
    for (const [key, value] of Object.entries(this.courseTypeMapping)) {
      if (title.includes(key.toUpperCase())) {
        return value;
      }
    }

    // Fallback basé sur des mots-clés dans le titre
    if (title.includes('YOGA')) return 'YOGA';
    if (title.includes('PILATES')) return 'PILATES';
    if (title.includes('SPINNING') || title.includes('CYCLING')) return 'SPINNING';
    if (title.includes('CARDIO')) return 'CARDIO';
    if (title.includes('MUSCULATION') || title.includes('STRENGTH')) return 'MUSCULATION';
    if (title.includes('FITNESS') || title.includes('TRAINING')) return 'FITNESS';

    return 'FITNESS'; // Valeur par défaut
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

  // Récupérer le nom du coach
  getCoachName(planning: Planning): string {
    // Si vous avez un service pour récupérer les coachs, utilisez-le ici
    // Pour l'instant, on retourne un placeholder
    return `Coach ${planning.coachId}`;
  }

  onEventClick(planning: Planning): void {
    alert(`Vous avez sélectionné:\n${planning.titre}\n${this.getEventDuration(planning.dateDebut, planning.dateFin)}\nAvec ${this.getCoachName(planning)}\n\nFonctionnalité de réservation à implémenter.`);
  }

  // Initialiser la semaine courante (lundi de cette semaine)
  initializeCurrentWeek(): void {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Ajuster pour lundi
    this.currentWeekStart = new Date(today.setDate(diff));
  }
}
