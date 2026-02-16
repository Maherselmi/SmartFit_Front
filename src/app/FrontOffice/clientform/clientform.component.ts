import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MealPlanService, MealPlan, Repas } from '../../services/meal-plan.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './clientform.component.html',
  styleUrls: ['./clientform.component.css']
})
export class ClientFormComponent implements OnInit {
  clientForm!: FormGroup;
  mealPlan: MealPlan | null = null;
  isLoading = false;
  errorMessage = '';
  currentClientId: number = 1;
  currentClientName: string = 'Lamia';

  // Debug info
  debugInfo: any = null;
  rawResponse: any = null;

  // Données du client
  currentClientData: any = {
    id: 1,
    nom: 'Lamia',
    age: 30,
    poids: 65,
    taille: 170,
    objectif: '',
    genre: 'FEMME',
    niveau_activite: 'MODERE',
    allergies: [],
    preferences: {}
  };

  readonly OBJECTIFS = [
    { value: 'MAIGRIR', label: '🎯 Maigrir' },
    { value: 'PRISE_MASSE', label: '💪 Prise de masse' },
    { value: 'MAINTENIR', label: '⚖️ Maintenir le poids' }
  ];

  constructor(
    private fb: FormBuilder,
    private mealPlanService: MealPlanService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    console.log('✅ ClientFormComponent initialized');
  }

  private initializeForm(): void {
    this.clientForm = this.fb.group({
      objectif: ['', Validators.required]
    });
  }

  onSubmit(): void {
    console.log('🔄 Generating meal plan with Flask AI');

    if (this.clientForm.invalid) {
      console.log('❌ Please select an objective');
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.mealPlan = null;
    this.debugInfo = null;
    this.rawResponse = null;

    const selectedObjectif = this.clientForm.get('objectif')?.value;
    console.log(`🎯 Selected objective: ${selectedObjectif}`);

    // Mettre à jour l'objectif du client
    this.currentClientData.objectif = selectedObjectif;

    this.generateFlaskMealPlan();
  }

  private generateFlaskMealPlan(): void {
    this.mealPlanService.generateFlaskMealPlan(this.currentClientData).subscribe({
      next: (response) => {
        console.log('✅ Flask response received:', response);
        this.rawResponse = response;

        // DEBUG: Afficher toute la structure de la réponse
        this.debugResponse(response);

        // Vérifier si la réponse contient meal_plan
        const flaskMealPlan = response.meal_plan || response;
        console.log('📦 Flask meal plan data:', flaskMealPlan);

        // Adapter la réponse Flask à votre interface MealPlan
        const adaptedPlan = this.adaptFlaskResponseToMealPlan(flaskMealPlan);
        this.mealPlan = adaptedPlan;
        this.isLoading = false;

        this.logMealPlanDetails(adaptedPlan);
      },
      error: (err) => {
        console.error('❌ Error generating Flask meal plan:', err);
        this.handleError('Erreur lors de la génération du plan alimentaire: ' + err.message);
      }
    });
  }

  /**
   * DEBUG: Analyser la structure de la réponse Flask
   */
  private debugResponse(response: any): void {
    console.log('🔍 === DEBUG FLASK RESPONSE STRUCTURE ===');
    console.log('Response keys:', Object.keys(response));

    this.debugInfo = {
      hasMealPlan: !!response.meal_plan,
      hasDailyPlan: !!response.daily_plan,
      hasRepas: !!response.repas,
      hasMeals: !!response.meals,
      responseStructure: this.getObjectStructure(response)
    };

    console.log('📊 Debug Info:', this.debugInfo);
  }

  /**
   * Obtenir la structure d'un objet pour le débogage
   */
  private getObjectStructure(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    const structure: any = {};
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        structure[key] = `Array[${obj[key].length}]`;
      } else if (typeof obj[key] === 'object') {
        structure[key] = 'Object';
      } else {
        structure[key] = typeof obj[key];
      }
    }
    return structure;
  }

  /**
   * Adapte la réponse Flask à l'interface MealPlan d'Angular
   */
  private adaptFlaskResponseToMealPlan(flaskResponse: any): MealPlan {
    console.log('🔄 Adapting Flask response to MealPlan interface');

    // Structure de base du plan alimentaire
    const adaptedPlan: MealPlan = {
      id: flaskResponse.id || Date.now(),
      nom: `Plan ${this.currentClientData.objectif} - 7 Jours`,
      dateDebut: new Date().toISOString().split('T')[0],
      dateFin: this.calculateEndDate(),
      totalCaloriesCible: flaskResponse.nutrition_targets?.total_calories || 1738,
      proteinesCible: flaskResponse.nutrition_targets?.proteins_g || 143,
      glucidesCible: flaskResponse.nutrition_targets?.carbs_g || 131,
      lipidesCible: flaskResponse.nutrition_targets?.fats_g || 71,
      genereParIA: true,
      typePlan: this.currentClientData.objectif,
      client: this.currentClientData,
      repas: this.extractAllMealsFromFlask(flaskResponse)
    };

    return adaptedPlan;
  }

  /**
   * Extrait tous les repas de la structure Flask daily_plan
   */
  private extractAllMealsFromFlask(flaskResponse: any): Repas[] {
    console.log('🍽️ Extracting meals from Flask daily_plan');

    const allMeals: Repas[] = [];

    // Vérifier daily_plan (structure principale)
    if (flaskResponse.daily_plan && Array.isArray(flaskResponse.daily_plan)) {
      console.log('📅 Processing daily_plan with', flaskResponse.daily_plan.length, 'days');

      // Prendre seulement le premier jour pour l'affichage (ou vous pouvez adapter pour tous les jours)
      const firstDay = flaskResponse.daily_plan[0];

      if (firstDay.meals && typeof firstDay.meals === 'object') {
        // Extraire chaque type de repas (breakfast, lunch, dinner, snack)
        Object.keys(firstDay.meals).forEach(mealType => {
          const mealData = firstDay.meals[mealType];
          if (mealData && mealData.foods && Array.isArray(mealData.foods)) {
            const adaptedMeal = this.createRepasFromFlaskMeal(mealData, mealType);
            if (adaptedMeal) {
              allMeals.push(adaptedMeal);
            }
          }
        });
      }
    }

    console.log(`✅ Extracted ${allMeals.length} meals total`);
    return allMeals;
  }

  /**
   * Créer un repas à partir des données Flask
   */
  private createRepasFromFlaskMeal(mealData: any, mealType: string): Repas {
    const adaptedMealType = this.mapFlaskMealType(mealType);

    const repas: Repas = {
      id: Date.now() + Math.random(), // ID unique
      type: adaptedMealType,
      caloriesTotales: mealData.nutrition?.calories || 0,
      proteinesTotales: mealData.nutrition?.proteins || 0,
      glucidesTotales: mealData.nutrition?.carbs || 0,
      lipidesTotales: mealData.nutrition?.fats || 0,
      composants: this.createComposantsFromFlaskFoods(mealData.foods || [])
    };

    console.log(`🍽️ Created ${adaptedMealType} with ${repas.composants.length} foods`);
    return repas;
  }

  /**
   * Mappe les types de repas Flask vers vos types Angular
   */
  private mapFlaskMealType(flaskMealType: string): string {
    const mealTypeMap: { [key: string]: string } = {
      'breakfast': 'PETIT_DEJEUNER',
      'lunch': 'DEJEUNER',
      'dinner': 'DINER',
      'snack': 'COLLATION'
    };

    return mealTypeMap[flaskMealType] || 'DEJEUNER';
  }

  /**
   * Créer les composants à partir des aliments Flask
   */
  private createComposantsFromFlaskFoods(foods: any[]): any[] {
    if (!Array.isArray(foods) || foods.length === 0) {
      return this.createSampleFoods();
    }

    return foods.map((food, index) => {
      return {
        id: food.id || index + 1,
        description: food.name || 'Aliment',
        quantite: food.portion_size || 100,
        modeCuisson: this.determineCookingMethod(food),
        calories: food.actual_calories || food.calories_per_100g || 0,
        proteines: food.proteins || 0,
        glucides: food.carbs || 0,
        lipides: food.fats || 0,
        aliment: {
          id: food.id || index + 1,
          nom: food.name || 'Aliment',
          calories: food.calories_per_100g || 0,
          proteines: food.proteins || 0,
          glucides: food.carbs || 0,
          lipides: food.fats || 0
        }
      };
    });
  }

  /**
   * Détermine le mode de cuisson basé sur le nom ou la catégorie
   */
  private determineCookingMethod(food: any): string {
    const name = (food.name || '').toLowerCase();

    if (name.includes('grill') || name.includes('grillé')) return 'GRILLE';
    if (name.includes('vapeur')) return 'VAPEUR';
    if (name.includes('rôti') || name.includes('roti')) return 'ROTI';
    if (name.includes('sauté') || name.includes('saute')) return 'SAUTE';
    if (name.includes('bouilli')) return 'BOUILLI';

    return 'NON_SPECIFIE';
  }

  /**
   * Créer des aliments d'exemple
   */
  private createSampleFoods(): any[] {
    return [
      {
        id: 1,
        description: 'Exemple aliment 1',
        quantite: 100,
        modeCuisson: 'GRILLE',
        calories: 200,
        proteines: 15,
        glucides: 25,
        lipides: 8,
        aliment: {
          id: 1,
          nom: 'Poulet grillé',
          calories: 200,
          proteines: 15,
          glucides: 25,
          lipides: 8
        }
      },
      {
        id: 2,
        description: 'Exemple aliment 2',
        quantite: 150,
        modeCuisson: 'BOUILLI',
        calories: 180,
        proteines: 8,
        glucides: 30,
        lipides: 5,
        aliment: {
          id: 2,
          nom: 'Riz complet',
          calories: 180,
          proteines: 8,
          glucides: 30,
          lipides: 5
        }
      }
    ];
  }

  /**
   * Calcule la date de fin (7 jours)
   */
  private calculateEndDate(): string {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    return endDate.toISOString().split('T')[0];
  }

  /**
   * Log détaillé
   */
  private logMealPlanDetails(plan: MealPlan): void {
    console.log('🔍 === FINAL MEAL PLAN ===');
    console.log('📊 Plan Name:', plan.nom);
    console.log('🎯 Goal:', plan.typePlan);
    console.log('🔥 Total Calories:', plan.totalCaloriesCible);
    console.log('🍽️ Number of Meals:', plan.repas?.length || 0);

    if (plan.repas && plan.repas.length > 0) {
      plan.repas.forEach((repas, index) => {
        console.log(`   ${index + 1}. ${repas.type} - ${repas.caloriesTotales} kcal - ${repas.composants.length} aliments`);
      });
    }
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    this.isLoading = false;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.clientForm.controls).forEach(key => {
      this.clientForm.get(key)?.markAsTouched();
    });
  }

  resetForm(): void {
    this.clientForm.reset();
    this.mealPlan = null;
    this.errorMessage = '';
    this.debugInfo = null;
    this.rawResponse = null;
    console.log('🔄 Form reset');
  }

  get canSubmit(): boolean {
    return this.clientForm.valid && !this.isLoading;
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.clientForm.get(fieldName);
    return field ? field.hasError(errorType) && (field.touched || field.dirty) : false;
  }

  // Méthode utilitaire pour grouper les repas par type
  getMealsByType(type: string): Repas[] {
    return this.mealPlan?.repas?.filter(repas => repas.type === type) || [];
  }

  // Méthode de test
  testWithSampleData(): void {
    console.log('🧪 Testing with sample data');
  }



}
