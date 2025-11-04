import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Coach } from 'src/app/Models/Coach';
import {CoachService} from "../../../services/coach.service";

@Component({
  selector: 'app-add-coach',
  templateUrl: './add-coach.component.html',
  styleUrls: ['./add-coach.component.css']
})
export class CoachFormComponent implements OnInit {

  coach: Coach = { nom: '', prenom: '', specialite: '', email: '', telephone: '' };
  isEditMode = false;
  successMessage: string = '';

  constructor(
    private coachService: CoachService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.coachService.getCoachById(+id).subscribe(data => this.coach = data);
    }
  }

  onSubmit() {
    if (this.isEditMode) {
      // ✅ Mode édition
      this.coachService.updateCoach(this.coach.id!, this.coach).subscribe(() => {
        this.successMessage = 'Coach mis à jour avec succès ✅';
        setTimeout(() => this.router.navigate(['/liste-coachs']), 1500);
      });
    } else {
      // ✅ Mode ajout
      this.coachService.createCoach(this.coach).subscribe(() => {
        this.successMessage = 'Coach ajouté avec succès ✅';
        // attendre 1.5 secondes pour afficher le message puis rediriger
        setTimeout(() => {
          this.router.navigate(['/Liste-Coaches']);
        }, 1500);
      });
    }
  }
}
