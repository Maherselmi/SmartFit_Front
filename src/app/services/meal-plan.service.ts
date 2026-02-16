import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timeout, catchError } from 'rxjs';

export interface MealPlan {
  id: number;
  nom: string;
  dateDebut: string;
  dateFin: string;
  totalCaloriesCible: number;
  proteinesCible: number;
  glucidesCible: number;
  lipidesCible: number;
  genereParIA: boolean;
  typePlan: string;
  client: any;
  repas: Repas[];
}

export interface Repas {
  id: number;
  type: string;
  caloriesTotales: number;
  proteinesTotales: number;
  glucidesTotales: number;
  lipidesTotales: number;
  composants: ComposantRepas[];
}

export interface ComposantRepas {
  id: number;
  description: string;
  quantite: number;
  modeCuisson: string;
  calories: number;
  proteines: number;
  glucides: number;
  lipides: number;
  aliment: Aliment;
}

export interface Aliment {
  id: number;
  nom: string;
  calories: number;
  proteines: number;
  glucides: number;
  lipides: number;
}

@Injectable({
  providedIn: 'root'
})
export class MealPlanService {
  private apiUrl = 'http://localhost:9090/api';

  constructor(private http: HttpClient) {
    console.log('✅ MealPlanService initialized');
  }

  // Generate AI meal plan for existing client
  generateAIMealPlan(clientId: number): Observable<MealPlan> {
    console.log(`🔄 Generating AI meal plan for existing client ID: ${clientId}`);

    return this.http.post<MealPlan>(`${this.apiUrl}/ai/generate-meal-plan/${clientId}`, {})
      .pipe(
        timeout(45000),
        catchError(this.handleError('generateAIMealPlan'))
      );
  }

  // GET client meal plans
  getClientMealPlans(clientId: number): Observable<MealPlan[]> {
    console.log(`📋 Fetching meal plans for client ID: ${clientId}`);
    return this.http.get<MealPlan[]>(`${this.apiUrl}/ai/meal-plans/${clientId}`)
      .pipe(
        timeout(10000),
        catchError(this.handleError('getClientMealPlans'))
      );
  }

  // GET all meal plans
  getAllMealPlans(): Observable<MealPlan[]> {
    return this.http.get<MealPlan[]>(`${this.apiUrl}/plans-alimentaires`)
      .pipe(
        timeout(10000),
        catchError(this.handleError('getAllMealPlans'))
      );
  }

  // GET meal plan by ID
  getMealPlanById(id: number): Observable<MealPlan> {
    return this.http.get<MealPlan>(`${this.apiUrl}/plans-alimentaires/${id}`)
      .pipe(
        timeout(10000),
        catchError(this.handleError('getMealPlanById'))
      );
  }

  // Update client objective
  updateClientObjective(clientId: number, objectif: string): Observable<any> {
    console.log(`🔄 Updating client ${clientId} objective to: ${objectif}`);

    return this.http.put(`${this.apiUrl}/clients/${clientId}/objectif`, { objectif })
      .pipe(
        timeout(10000),
        catchError(this.handleError('updateClientObjective'))
      );
  }

  // Get client by ID
  getClient(clientId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/clients/${clientId}`)
      .pipe(
        timeout(10000),
        catchError(this.handleError('getClient'))
      );
  }

  // Create meal plan with foods (nouvelle méthode)
  createMealPlanWithFoods(planData: any): Observable<MealPlan> {
    return this.http.post<MealPlan>(`${this.apiUrl}/plans-alimentaires/with-foods`, planData)
      .pipe(
        timeout(15000),
        catchError(this.handleError('createMealPlanWithFoods'))
      );
  }
  // ✅ Generate meal plan from Flask AI backend
  // ✅ Generate meal plan from Flask AI backend - UPDATED
  generateFlaskMealPlan(client: any): Observable<any> {
<<<<<<< HEAD
    const flaskUrl = 'http://localhost:5003/generate_meal_plan';
=======
    const flaskUrl = 'http://localhost:5000/generate_meal_plan';
>>>>>>> 2eb60c76dd666b104ac0c3a54a2fa01bcd4b3999
    console.log("📡 Sending data to Flask:", client);

    return this.http.post(flaskUrl, {
      id: client.id,
      nom: client.nom,
      age: client.age,
      poids: client.poids,
      taille: client.taille,
      objectif: client.objectif,
      genre: client.genre,
      niveau_activite: client.niveau_activite,
      allergies: client.allergies || [],
      preferences: client.preferences || {}
    }).pipe(
      timeout(45000),
      catchError(this.handleError('generateFlaskMealPlan'))
    );
  }


  private handleError(operation: string) {
    return (error: HttpErrorResponse) => {
      console.error(`❌ ${operation} failed:`, error);

      let errorMessage = 'Une erreur est survenue';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Erreur: ${error.error.message}`;
      } else {
        switch (error.status) {
          case 0:
            errorMessage = 'Impossible de se connecter au serveur. Vérifiez votre connexion.';
            break;
          case 404:
            errorMessage = 'Service non trouvé. Vérifiez que le serveur Spring Boot est démarré.';
            break;
          case 500:
            errorMessage = 'Erreur interne du serveur. Vérifiez les logs Spring Boot.';
            break;
          default:
            errorMessage = `Erreur ${error.status}: ${error.message}`;
        }
      }

      return throwError(() => new Error(errorMessage));
    };
  }
}
