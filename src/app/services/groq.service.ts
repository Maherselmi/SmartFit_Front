import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface GroqMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GroqChatRequest {
  model: string;
  messages: GroqMessage[];
}

export interface GroqChatResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class GroqService {
  private apiUrl = environment.groqApiUrl;
  private apiKey = environment.groqApiKey;
  private model = 'llama-3.3-70b-versatile';

  constructor(private http: HttpClient) { }

  // Generate subscription recommendations based on user profile
  generateSubscriptionOffers(userProfile: {
    activityLevel: string;
    lifestyle: string;
    additionalInfo?: string;
  }): Observable<GroqChatResponse> {
    const prompt = this.buildRecommendationPrompt(userProfile);
    
    const messages: GroqMessage[] = [
      {
        role: 'system',
        content: 'You are a fitness subscription advisor for SmartFit gym. Generate exactly 3 personalized subscription offers in JSON format. IMPORTANT: The "name" field must be EXACTLY one of these types: "Premium Mensuel", "Premium Hebdomadaire", "Basique Mensuel", "Basique Hebdomadaire", "Etudiant Mensuel", "Pro Annuel", "Family Mensuel". Each offer must include: name (must be one of the 7 types listed), description (string, 1-2 sentences), price (number in euros, reasonable range 25-150), duration (number in days: 7 for Hebdomadaire, 30 for Mensuel, 365 for Annuel), and features (array of 3-5 strings). Return ONLY a valid JSON array with exactly 3 objects using ONLY the subscription types provided. No markdown, no code blocks, no explanation, just pure JSON array starting with [ and ending with ].'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const body: GroqChatRequest = {
      model: this.model,
      messages: messages
    };

    return this.http.post<GroqChatResponse>(this.apiUrl, body, { headers });
  }

  private buildRecommendationPrompt(userProfile: {
    activityLevel: string;
    lifestyle: string;
    additionalInfo?: string;
  }): string {
    let prompt = `User Profile:\n`;
    prompt += `- Activity Level: ${this.getActivityLevelDescription(userProfile.activityLevel)}\n`;
    prompt += `- Lifestyle: ${this.getLifestyleDescription(userProfile.lifestyle)}\n`;
    
    if (userProfile.additionalInfo) {
      prompt += `- Additional Info: ${userProfile.additionalInfo}\n`;
    }
    
    prompt += `\nGenerate 3 personalized fitness subscription offers as a JSON array. IMPORTANT: Use ONLY these subscription types: "Premium Mensuel", "Premium Hebdomadaire", "Basique Mensuel", "Basique Hebdomadaire", "Etudiant Mensuel", "Pro Annuel", "Family Mensuel". Make them relevant to this profile. Return ONLY the JSON array, nothing else.`;
    
    return prompt;
  }

  private getActivityLevelDescription(level: string): string {
    const descriptions: { [key: string]: string } = {
      'sedentary': 'Sedentary - Little or no physical activity',
      'light': 'Light - Physical activity 1-3 times per week',
      'moderate': 'Moderate - Physical activity 3-5 times per week',
      'active': 'Active - Physical activity 5-7 times per week',
      'very-active': 'Very Active - Intense daily physical activity'
    };
    return descriptions[level] || level;
  }

  private getLifestyleDescription(lifestyle: string): string {
    const descriptions: { [key: string]: string } = {
      'busy-professional': 'Busy Professional - Limited time available',
      'student': 'Student - Limited budget, flexible schedule',
      'parent': 'Parent - Family schedule, needs flexibility',
      'retired': 'Retired - Lots of free time',
      'athlete': 'Athlete - Regular intense training'
    };
    return descriptions[lifestyle] || lifestyle;
  }
}

