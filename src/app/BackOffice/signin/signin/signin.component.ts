import { Component } from '@angular/core';
import {AuthService} from "../../../services/signin.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  selectedTab: string = 'coach';

  coach = {
    email: '',
    password: ''
  };

  client = {
    email: '',
    password: ''
  };
  admin = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  loginCoach() {
    this.authService.loginCoach(this.coach).subscribe({
      next: (response) => {
        console.log('Coach connecté:', response);
        // Exemple : rediriger vers le dashboard coach
        this.router.navigate(['/dashboard-coach']);
      },
      error: (err) => {
        console.error('Erreur de connexion coach:', err);
        alert('Email ou mot de passe invalide pour le coach.');
      }
    });
  }

  loginClient() {
    this.authService.loginClient(this.client).subscribe({
      next: (response) => {
        console.log('Client connecté:', response);
        // Exemple : rediriger vers le dashboard client
<<<<<<< HEAD
        this.router.navigate(['/Index']);
=======
        this.router.navigate(['/Dashboard']);
>>>>>>> 2eb60c76dd666b104ac0c3a54a2fa01bcd4b3999
      },
      error: (err) => {
        console.error('Erreur de connexion client:', err);
        alert('Email ou mot de passe invalide pour le client.');
      }
    });
  }

  loginAdmin() {
    this.authService.loginAdmin(this.admin).subscribe({
      next: (response) => {
        console.log('Admin connecté:', response);
        // Exemple : rediriger vers le dashboard client
        this.router.navigate(['/Dashboard']);
      },
      error: (err) => {
        console.error('Erreur de connexion client:', err);
        alert('Email ou mot de passe invalide pour le client.');
      }
    });
  }


}
