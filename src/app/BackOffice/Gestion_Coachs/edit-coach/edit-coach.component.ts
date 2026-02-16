import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Coach } from 'src/app/Models/Coach';
import {CoachService} from "../../../services/coach.service";

@Component({
  selector: 'app-edit-coach',
  templateUrl: './edit-coach.component.html',
  styleUrls: ['./edit-coach.component.css']
})
export class EditCoachComponent implements OnInit {
  coach: Coach = new Coach();
  successMessage = '';

  constructor(
    private coachService: CoachService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.coachService.getCoachById(id).subscribe({
        next: (data) => (this.coach = data),
        error: (err) => console.error('Erreur de chargement du coach', err)
      });
    }
  }

  onSubmit() {
    this.coachService.updateCoach(this.coach.id!, this.coach).subscribe({
      next: () => {
        this.successMessage = 'Coach mis à jour avec succès ✅';
        setTimeout(() => {
          this.router.navigate(['/liste-coachs']);
        }, 1500);
      },
      error: (err) => console.error('Erreur lors de la mise à jour', err)
    });
  }
}
