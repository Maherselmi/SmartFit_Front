import { Component } from '@angular/core';
import { GroqService } from '../../services/groq.service';
import { AbonnementsService, Abonnement } from '../../services/abonnements.service';

interface SubscriptionOffer {
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
}

@Component({
  selector: 'app-subscription-recommendation',
  templateUrl: './subscription-recommendation.component.html',
  styleUrls: ['./subscription-recommendation.component.css']
})
export class SubscriptionRecommendationComponent {
  // Form data
  activityLevel: string = '';
  lifestyle: string = '';
  additionalInfo: string = '';

  // States
  loading = false;
  offers: SubscriptionOffer[] = [];
  error = '';
  showOffers = false;

  // Activity levels
  activityLevels = [
    { value: 'sedentary', label: 'Sédentaire - Peu ou pas d\'activité physique' },
    { value: 'light', label: 'Légère - Activité physique 1-3 fois par semaine' },
    { value: 'moderate', label: 'Modérée - Activité physique 3-5 fois par semaine' },
    { value: 'active', label: 'Active - Activité physique 5-7 fois par semaine' },
    { value: 'very-active', label: 'Très active - Activité physique intense quotidienne' }
  ];

  // Lifestyle options
  lifestyles = [
    { value: 'busy-professional', label: 'Professionnel occupé - Peu de temps disponible' },
    { value: 'student', label: 'Étudiant - Budget limité, horaires flexibles' },
    { value: 'parent', label: 'Parent - Horaires familiaux, besoin de flexibilité' },
    { value: 'retired', label: 'Retraité - Beaucoup de temps libre' },
    { value: 'athlete', label: 'Athlète - Entraînement intensif régulier' }
  ];

  constructor(
    private groqService: GroqService,
    private abonnementsService: AbonnementsService
  ) {}

  onSubmit(): void {
    if (!this.activityLevel || !this.lifestyle) {
      this.error = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    this.loading = true;
    this.error = '';
    this.showOffers = false;
    this.offers = [];

    const userProfile = {
      activityLevel: this.activityLevel,
      lifestyle: this.lifestyle,
      additionalInfo: this.additionalInfo || undefined
    };

    this.groqService.generateSubscriptionOffers(userProfile).subscribe({
      next: (response) => {
        try {
          const content = response.choices[0]?.message?.content || '';
          // Parse JSON from the response (might be wrapped in markdown code blocks)
          let jsonStr = content.trim();
          
          // Remove markdown code blocks if present
          if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          }
          
          // Extract JSON array if wrapped in text
          const jsonMatch = jsonStr.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            jsonStr = jsonMatch[0];
          }

          const parsedOffers = JSON.parse(jsonStr);
          
          if (Array.isArray(parsedOffers) && parsedOffers.length >= 3) {
            this.offers = parsedOffers.slice(0, 3).map((offer: any) => {
              // Validate and correct the subscription type
              let offerName = offer.name || 'Basique Mensuel';
              if (!this.validTypes.includes(offerName)) {
                // If not a valid type, use the closest match or default
                offerName = this.findClosestValidType(offerName);
              }
              
              // Calculate duration based on type
              let duration = parseInt(offer.duration) || 30;
              if (offerName.includes('Hebdomadaire')) {
                duration = 7;
              } else if (offerName.includes('Annuel')) {
                duration = 365;
              } else if (offerName.includes('Mensuel')) {
                duration = 30;
              }
              
              return {
                name: offerName,
                description: offer.description || '',
                price: parseFloat(offer.price) || 50,
                duration: duration,
                features: Array.isArray(offer.features) ? offer.features : []
              };
            });
            this.showOffers = true;
          } else {
            throw new Error('Format de réponse invalide');
          }
        } catch (error) {
          console.error('Erreur lors du parsing de la réponse:', error);
          this.error = 'Erreur lors de la génération des offres. Veuillez réessayer.';
          // Fallback: create default offers
          this.createDefaultOffers();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur API Groq:', err);
        this.error = 'Erreur lors de la communication avec le service. Veuillez réessayer.';
        this.loading = false;
        // Fallback: create default offers
        this.createDefaultOffers();
      }
    });
  }

  private createDefaultOffers(): void {
    this.offers = [
      {
        name: 'Basique Mensuel',
        description: 'Parfait pour débuter votre parcours fitness avec accès mensuel',
        price: 30,
        duration: 30,
        features: ['Accès aux équipements', 'Suivi mensuel', 'Support email']
      },
      {
        name: 'Premium Mensuel',
        description: 'Pour ceux qui veulent des résultats rapides avec accès premium',
        price: 60,
        duration: 30,
        features: ['Accès complet', 'Coaching personnalisé', 'Support 24/7', 'Plan nutritionnel']
      },
      {
        name: 'Pro Annuel',
        description: 'La solution complète pour les plus exigeants sur toute l\'année',
        price: 600,
        duration: 365,
        features: ['Tout inclus Premium', 'Coaching privé', 'Support prioritaire', 'Plan nutritionnel détaillé', 'Suivi quotidien']
      }
    ];
    this.showOffers = true;
  }

  // Valid subscription types
  private readonly validTypes = [
    'Premium Mensuel',
    'Premium Hebdomadaire',
    'Basique Mensuel',
    'Basique Hebdomadaire',
    'Etudiant Mensuel',
    'Pro Annuel',
    'Family Mensuel'
  ];

  selectOffer(offer: SubscriptionOffer): void {
    if (!confirm(`Confirmez-vous la sélection de l'offre "${offer.name}" ?`)) {
      return;
    }

    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + offer.duration);

    const abonnement: Abonnement = {
      typeAbonnement: offer.name,
      prix: offer.price,
      dateDebut: today.toISOString().split('T')[0], // Format YYYY-MM-DD
      dateFin: endDate.toISOString().split('T')[0],
      statut: 'ACTIVE',
      modePaiement: 'COMPTE_BANCAIRE',
      renouvellementAuto: false
    };

    this.abonnementsService.create(abonnement).subscribe({
      next: () => {
        alert(`Abonnement "${offer.name}" créé avec succès !`);
        this.resetForm();
      },
      error: (err) => {
        console.error('Erreur lors de la création de l\'abonnement:', err);
        alert('Erreur lors de la création de l\'abonnement. Veuillez réessayer.');
      }
    });
  }

  resetForm(): void {
    this.activityLevel = '';
    this.lifestyle = '';
    this.additionalInfo = '';
    this.offers = [];
    this.showOffers = false;
    this.error = '';
  }

  getActivityLevelLabel(value: string): string {
    return this.activityLevels.find(level => level.value === value)?.label || value;
  }

  getLifestyleLabel(value: string): string {
    return this.lifestyles.find(life => life.value === value)?.label || value;
  }

  get currentYear(): number {
    return new Date().getFullYear();
  }

  private findClosestValidType(type: string): string {
    const lowerType = type.toLowerCase();
    
    // Try to match based on keywords
    if (lowerType.includes('basique') || lowerType.includes('basic')) {
      return lowerType.includes('hebdo') || lowerType.includes('week') 
        ? 'Basique Hebdomadaire' 
        : 'Basique Mensuel';
    }
    if (lowerType.includes('premium')) {
      return lowerType.includes('hebdo') || lowerType.includes('week')
        ? 'Premium Hebdomadaire'
        : 'Premium Mensuel';
    }
    if (lowerType.includes('etudiant') || lowerType.includes('student')) {
      return 'Etudiant Mensuel';
    }
    if (lowerType.includes('pro') || lowerType.includes('annuel') || lowerType.includes('annual')) {
      return 'Pro Annuel';
    }
    if (lowerType.includes('family') || lowerType.includes('familie')) {
      return 'Family Mensuel';
    }
    
    // Default fallback
    return 'Basique Mensuel';
  }
}
