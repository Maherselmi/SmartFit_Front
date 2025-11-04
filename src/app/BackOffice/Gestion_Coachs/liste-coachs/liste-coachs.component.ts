import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Coach } from 'src/app/Models/Coach';
import {CoachService} from "../../../services/coach.service";

export interface PlanningSlot {
  id?: number;
  date: string;
  session: string;
  type_seance?: string;
  duree?: string;
  coach_id?: number;
  coach_nom?: string;
}

export interface CoachWithPlanning {
  coach_id: number;
  coach_name: string;
  planning: PlanningSlot[];
}

@Component({
  selector: 'app-liste-coachs',
  templateUrl: './liste-coachs.component.html',
  styleUrls: ['./liste-coachs.component.css']
})
export class CoachListComponent implements OnInit {

  coachs: Coach[] = [];
  selectedCoach: CoachWithPlanning | null = null;
  allPlannings: PlanningSlot[] = [];
  successMessage = '';
  isLoading = false;
  modalOpen = false;
  showAllPlannings = false;

  constructor(private coachService: CoachService, private router: Router) {}

  ngOnInit(): void {
    this.loadCoachs();
  }

  loadCoachs() {
    this.coachService.getAllCoachs().subscribe({
      next: (data) => {
        this.coachs = data;
        console.log('✅ Coachs chargés:', this.coachs);
      },
      error: (err) => console.error('❌ Erreur chargement coaches:', err)
    });
  }

  addCoach() {
    this.router.navigate(['/CoachFormComponent']);
  }

  deleteCoach(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce coach ?')) {
      this.coachService.deleteCoach(id).subscribe(() => {
        this.successMessage = 'Coach supprimé avec succès ✅';
        this.loadCoachs();
        setTimeout(() => this.successMessage = '', 2000);
      });
    }
  }

  // Afficher le planning d'un coach spécifique - VERSION CORRIGÉE
  showPlanning(coach: Coach) {
    this.isLoading = true;
    this.modalOpen = true;
    this.showAllPlannings = false;

    console.log('🔄 Chargement planning pour coach:', coach);

    this.coachService.getCoachPlanning(coach.id!).subscribe({
      next: (response: any) => {
        console.log('🔍 Réponse API planning:', response);

        let planningSlots: PlanningSlot[] = [];

        // ✅ Gestion de la réponse selon la structure de votre API Flask
        if (response && response.success !== false) {

          // Si la réponse contient un tableau 'plannings'
          if (response.plannings && Array.isArray(response.plannings)) {
            console.log('✅ Format: { plannings: [...] }');
            planningSlots = this.transformPlanningData(response.plannings, coach);
          }
          // Si la réponse est directement un tableau
          else if (Array.isArray(response)) {
            console.log('✅ Format: tableau direct');
            planningSlots = this.transformPlanningData(response, coach);
          }
          // Autres formats possibles
          else if (response.data && Array.isArray(response.data)) {
            console.log('✅ Format: { data: [...] }');
            planningSlots = this.transformPlanningData(response.data, coach);
          }
          else {
            console.warn('⚠️ Format de réponse inattendu:', response);
          }
        } else {
          console.warn('⚠️ Réponse indique un échec:', response);
        }

        console.log('📊 Planning transformé:', planningSlots);

        this.selectedCoach = {
          coach_id: coach.id!,
          coach_name: `${coach.prenom} ${coach.nom}`,
          planning: planningSlots
        };

        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Erreur chargement planning:', err);
        console.error('❌ Détails erreur:', err.error);

        // En cas d'erreur, afficher un message vide
        this.selectedCoach = {
          coach_id: coach.id!,
          coach_name: `${coach.prenom} ${coach.nom}`,
          planning: []
        };
        this.isLoading = false;
      }
    });
  }

  // ✅ Nouvelle méthode pour transformer les données de planning
  private transformPlanningData(data: any[], coach: Coach): PlanningSlot[] {
    return data.map((slot: any, index: number) => {
      console.log(`📦 Slot ${index}:`, slot);

      return {
        id: slot.id || index + 1,
        date: slot.date || '',
        session: slot.session || 'Session non définie',
        type_seance: this.getSessionType(slot.session),
        duree: this.getSessionDuration(slot.session),
        coach_id: slot.coach_id || coach.id,
        coach_nom: `${coach.prenom} ${coach.nom}`
      };
    });
  }

  // Afficher le planning de tous les coachs
  showAllCoachsPlanning() {
    this.isLoading = true;
    this.modalOpen = true;
    this.showAllPlannings = true;
    this.allPlannings = [];

    console.log('🔄 Chargement planning de tous les coachs');

    // Récupérer les plannings de chaque coach
    const planningPromises = this.coachs.map(coach =>
      this.coachService.getCoachPlanning(coach.id!).toPromise()
    );

    Promise.all(planningPromises).then(responses => {
      responses.forEach((response: any, index) => {
        const coach = this.coachs[index];

        if (response && response.success !== false) {
          let coachPlannings: PlanningSlot[] = [];

          // Même logique de transformation que showPlanning
          if (response.plannings && Array.isArray(response.plannings)) {
            coachPlannings = this.transformPlanningData(response.plannings, coach);
          } else if (Array.isArray(response)) {
            coachPlannings = this.transformPlanningData(response, coach);
          }

          this.allPlannings.push(...coachPlannings);
        }
      });

      // Trier les plannings par date
      this.allPlannings.sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateA - dateB;
      });

      this.isLoading = false;
      console.log('📊 Tous les plannings chargés:', this.allPlannings);

    }).catch(error => {
      console.error('❌ Erreur chargement plannings multiples:', error);
      this.isLoading = false;
    });
  }

  // Méthode pour déterminer le type de séance
  private getSessionType(session: string | undefined): string {
    if (!session) return 'Entraînement';

    const sessionLower = session.toLowerCase();

    if (sessionLower.includes('cardio')) return 'Cardio';
    if (sessionLower.includes('muscu') || sessionLower.includes('musculation')) return 'Musculation';
    if (sessionLower.includes('yoga')) return 'Yoga';
    if (sessionLower.includes('crossfit')) return 'CrossFit';
    if (sessionLower.includes('pilates')) return 'Pilates';
    if (sessionLower.includes('fitness')) return 'Fitness';

    return 'Entraînement';
  }

  // Méthode pour déterminer la durée
  private getSessionDuration(session: string | undefined): string {
    if (!session) return '60 min';

    const sessionLower = session.toLowerCase();

    if (sessionLower.includes('cardio')) return '45 min';
    if (sessionLower.includes('muscu') || sessionLower.includes('musculation')) return '90 min';
    if (sessionLower.includes('yoga') || sessionLower.includes('pilates')) return '60 min';
    if (sessionLower.includes('crossfit')) return '75 min';
    if (sessionLower.includes('intensif')) return '120 min';

    return '60 min';
  }

  closeModal() {
    this.selectedCoach = null;
    this.allPlannings = [];
    this.modalOpen = false;
    this.showAllPlannings = false;
  }

  getCoachName(): string {
    if (this.showAllPlannings) {
      return 'Tous les Coachs';
    }
    return this.selectedCoach?.coach_name || '';
  }

  getPlanning(): PlanningSlot[] {
    if (this.showAllPlannings) {
      return this.allPlannings;
    }
    return this.selectedCoach?.planning || [];
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'Date non définie';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }

      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erreur format date:', error);
      return dateString;
    }
  }

  getDayName(dateString: string | undefined): string {
    if (!dateString) return 'Jour inconnu';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }

      return date.toLocaleDateString('fr-FR', {
        weekday: 'long'
      });
    } catch (error) {
      console.error('Erreur jour de la semaine:', error);
      return 'Jour inconnu';
    }
  }

  capitalizeFirst(str: string | undefined): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  getBadgeClass(slot: PlanningSlot): string {
    if (!slot.session) return 'badge bg-secondary';

    const sessionLower = slot.session.toLowerCase();

    if (sessionLower.includes('matin')) return 'badge bg-primary';
    if (sessionLower.includes('après-midi') || sessionLower.includes('apres-midi')) return 'badge bg-warning text-dark';
    if (sessionLower.includes('soir')) return 'badge bg-info';
    if (sessionLower.includes('cardio')) return 'badge bg-success';
    if (sessionLower.includes('muscu')) return 'badge bg-danger';

    return 'badge bg-secondary';
  }
}
