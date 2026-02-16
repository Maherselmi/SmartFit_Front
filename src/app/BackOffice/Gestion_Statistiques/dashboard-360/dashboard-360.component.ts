import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Chart from "chart.js/auto";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

interface Client {
  nom: string;
  age?: number;
  objectif?: string;
  progression_estimee?: number;
  showTraining?: boolean;
  showDiet?: boolean;
}

@Component({
  selector: 'app-dashboard360',
  standalone: true,
  templateUrl: './dashboard-360.component.html',
  styleUrls: ['./dashboard-360.component.css'],
  imports: [CommonModule, HttpClientModule, FormsModule, RouterLink],
})
export class Dashboard360Component implements OnInit, AfterViewInit {
  clients: Client[] = [];
  averageProgression = 0;

  trainingRecommendations: { nom: string; training: any }[] = [];
  dietRecommendations: { nom: string; diet: any }[] = [];

  decisionSupport = {
    actions_fidelite: [] as string[],
    actions_sante: [] as string[],
    actions_rentabilite: [] as string[],
  };

  apiProgression = 'http://127.0.0.1:5000/predict_progression';
  apiTraining = 'http://127.0.0.1:5000/recommend_training';
  apiDiet = 'http://127.0.0.1:5000/recommend_diet';
  apiDecision = 'http://127.0.0.1:5000/decision_support';

  loading = false;
  loadingRecommendations = false;
  private chartInstance?: Chart;

  constructor(private http: HttpClient) {}

  // -------------------------------
  // 🚀 Cycle de vie
  // -------------------------------
  ngOnInit(): void {
    this.loadProgression();
    this.loadDecisionSupport();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.createChart(), 1200);
  }

  // -------------------------------
  // 📈 Chargement de la progression
  // -------------------------------
  loadProgression(): void {
    this.loading = true;

    this.http.get<any>(this.apiProgression).subscribe({
      next: (res) => {
        const list = res?.result ?? res ?? [];
        this.clients = (list as Client[]).map((c) => ({
          ...c,
          showTraining: false,
          showDiet: false,
          progression_estimee: c.progression_estimee ?? 0,
        }));
        console.log('📊 Données reçues :', this.clients);

        this.calculateAverageProgression();
        this.loadIndividualRecommendations();

        // ✅ Crée le graphique une fois que les clients sont bien chargés
        this.createChart();

        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erreur progression :', err);
        this.clients = [];
        this.loading = false;
      },
    });
  }


  // -------------------------------
  // 📊 Calcul de la moyenne
  // -------------------------------
  calculateAverageProgression(): void {
    if (this.clients.length === 0) {
      this.averageProgression = 0;
      return;
    }
    const sum = this.clients.reduce(
      (acc, c) => acc + ((c.progression_estimee ?? 0) * 100),
      0
    );
    this.averageProgression = parseFloat(
      (sum / this.clients.length).toFixed(1)
    );
  }

  // -------------------------------
  // 🤖 Chargement des recommandations
  // -------------------------------
  loadIndividualRecommendations(): void {
    if (this.clients.length === 0) return;

    this.loadingRecommendations = true;
    let pending = this.clients.length * 2;

    this.clients.forEach((c) => {
      // Entraînement
      this.http
        .get<any>(
          `${this.apiTraining}?age=${c.age ?? 30}&objectif=${c.objectif ?? 'forme'}`
        )
        .subscribe({
          next: (res) => {
            this.trainingRecommendations.push({
              nom: c.nom,
              training: res?.result ?? 'Aucune recommandation',
            });
            if (--pending === 0) this.loadingRecommendations = false;
          },
          error: () => {
            if (--pending === 0) this.loadingRecommendations = false;
          },
        });

      // Régime alimentaire
      this.http
        .get<any>(
          `${this.apiDiet}?objectif=${c.objectif ?? 'forme'}&calories=2000`
        )
        .subscribe({
          next: (res) => {
            this.dietRecommendations.push({
              nom: c.nom,
              diet: res?.result ?? 'Aucun plan disponible',
            });
            if (--pending === 0) this.loadingRecommendations = false;
          },
          error: () => {
            if (--pending === 0) this.loadingRecommendations = false;
          },
        });
    });
  }

  // -------------------------------
  // 🎯 Fonctions d’affichage
  // -------------------------------
  toggleTraining(c: Client) {
    c.showTraining = !c.showTraining;
  }

  toggleDiet(c: Client) {
    c.showDiet = !c.showDiet;
  }

  getProgressionPourcent(progression?: number): string {
    const valeur = Number(progression ?? 0) * 100;
    return valeur.toFixed(1);
  }



  // -------------------------------
  // 🔄 Rafraîchir toutes les données
  // -------------------------------
  refreshAll(): void {
    this.trainingRecommendations = [];
    this.dietRecommendations = [];
    this.loadProgression();
    this.loadDecisionSupport();
  }

  // -------------------------------
  // 💡 Support décisionnel
  // -------------------------------
  loadDecisionSupport(): void {
    this.http.get<any>(this.apiDecision).subscribe({
      next: (res) => {
        console.log('🧩 Décision support:', res);
        this.decisionSupport = res?.result || {
          actions_fidelite: [],
          actions_sante: [],
          actions_rentabilite: []
        };
      },
      error: (err) => {
        console.error('❌ Erreur décision support:', err);
        this.decisionSupport = {
          actions_fidelite: [],
          actions_sante: [],
          actions_rentabilite: []
        };
      }
    });
  }


  // -------------------------------
  // 📉 Création du graphique
  // -------------------------------
  createChart(): void {
    const canvas = document.getElementById('progressChart') as HTMLCanvasElement;
    if (!canvas || this.clients.length === 0) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.chartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.clients.map((c) => c.nom),
        datasets: [
          {
            label: 'Progression (%)',
            data: this.clients.map((c) => (c.progression_estimee ?? 0) * 100),
            backgroundColor: '#6366f1',
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 100 } },
      },
    });
  }
  getTrainingFor(name: string) {
    const training = this.trainingRecommendations.find(t => t.nom === name)?.training;
    return typeof training === 'string' ? JSON.parse(training) : training;
  }

  getDietFor(name: string) {
    const diet = this.dietRecommendations.find(d => d.nom === name)?.diet;
    return typeof diet === 'string' ? JSON.parse(diet) : diet;
  }

}
