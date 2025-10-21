import { Component } from '@angular/core';
import { SignupService } from '../../../services/signup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  // ✅ Variable de rôle sélectionné (coach ou client)
  selectedTab: string = 'coach';

  // ✅ Modèles de formulaire
  coach = {
    nom: '',
    prenom: '',
    specialite: '',
    telephone: '',
    email: '',
    password: ''
  };

  client = {
    nom: '',
    age: '',
    poids: 0,
    objectif: '',
    progressionEstimee: 0,
    email: '',
    password: ''
  };

  constructor(private signupService: SignupService, private router: Router) {}

  // ✅ Inscription coach
  registerCoach() {
    this.signupService.registerCoach(this.coach).subscribe({
      next: () => {
        alert('Coach inscrit avec succès !');
        this.router.navigate(['/login']);
      },
      error: (err) => alert('Erreur : ' + err.message)
    });
  }

  // ✅ Inscription client
  registerClient() {
    this.signupService.registerClient(this.client).subscribe({
      next: () => {
        alert('Client inscrit avec succès !');
        this.router.navigate(['/login']);
      },
      error: (err) => alert('Erreur : ' + err.message)
    });
  }
}
