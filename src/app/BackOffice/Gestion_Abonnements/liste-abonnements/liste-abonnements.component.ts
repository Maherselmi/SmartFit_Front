<<<<<<< HEAD
import { Component } from '@angular/core';
=======
import { Component, OnInit } from '@angular/core';
import { AbonnementsService, Abonnement } from '../../../services/abonnements.service';
>>>>>>> 4c7b750 (Added Subscription Module (backoffice))

@Component({
  selector: 'app-liste-abonnements',
  templateUrl: './liste-abonnements.component.html',
  styleUrls: ['./liste-abonnements.component.css']
})
<<<<<<< HEAD
export class ListeAbonnementsComponent {

=======
export class ListeAbonnementsComponent implements OnInit {
  
  abonnements: Abonnement[] = [];
  selectedAbonnement: Abonnement | null = null;
  showForm = false;
  showDetails = false;
  isEditing = false;
  loading = false;
  error = '';

  // Formulaire pour créer/modifier un abonnement
  abonnementForm: Abonnement = {
    typeAbonnement: '',
    prix: 0,
    dateDebut: '',
    dateFin: '',
    statut: 'ACTIVE',
    modePaiement: 'COMPTE_BANCAIRE',
    renouvellementAuto: false
  };

  // Options pour les select
  statutOptions = ['ACTIVE', 'SUSPENDU', 'ANNULE', 'EXPIRE'];
  modePaiementOptions = ['COMPTE_BANCAIRE', 'PAYPAL', 'VIREMENT', 'ESPECE'];

  constructor(private abonnementsService: AbonnementsService) { }

  ngOnInit(): void {
    this.loadAbonnements();
  }

  // 🔹 Charger tous les abonnements
  loadAbonnements(): void {
    this.loading = true;
    this.abonnementsService.getAll().subscribe({
      next: (data) => {
        this.abonnements = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des abonnements';
        this.loading = false;
        console.error(err);
      }
    });
  }

  // 🔹 Afficher le formulaire de création
  showCreateForm(): void {
    this.resetForm();
    this.showForm = true;
    this.showDetails = false;
    this.isEditing = false;
  }

  // 🔹 Afficher les détails d'un abonnement
  showAbonnementDetails(abonnement: Abonnement): void {
    this.selectedAbonnement = { ...abonnement };
    this.showDetails = true;
    this.showForm = false;
  }

  // 🔹 Afficher le formulaire d'édition
  editAbonnement(abonnement: Abonnement): void {
    this.abonnementForm = { ...abonnement };
    this.selectedAbonnement = abonnement;
    this.showForm = true;
    this.showDetails = false;
    this.isEditing = true;
  }

  // 🔹 Sauvegarder (créer ou modifier)
  saveAbonnement(): void {
    if (this.isEditing && this.selectedAbonnement?.id) {
      // Modification
      this.abonnementsService.update(this.selectedAbonnement.id, this.abonnementForm).subscribe({
        next: () => {
          this.loadAbonnements();
          this.hideForm();
        },
        error: (err) => {
          this.error = 'Erreur lors de la modification';
          console.error(err);
        }
      });
    } else {
      // Création
      this.abonnementsService.create(this.abonnementForm).subscribe({
        next: () => {
          this.loadAbonnements();
          this.hideForm();
        },
        error: (err) => {
          this.error = 'Erreur lors de la création';
          console.error(err);
        }
      });
    }
  }

  // 🔹 Supprimer un abonnement
  deleteAbonnement(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet abonnement ?')) {
      this.abonnementsService.delete(id).subscribe({
        next: () => {
          this.loadAbonnements();
        },
        error: (err) => {
          this.error = 'Erreur lors de la suppression';
          console.error(err);
        }
      });
    }
  }

  // 🔹 Masquer le formulaire
  hideForm(): void {
    this.showForm = false;
    this.showDetails = false;
    this.resetForm();
  }

  // 🔹 Réinitialiser le formulaire
  resetForm(): void {
    this.abonnementForm = {
      typeAbonnement: '',
      prix: 0,
      dateDebut: '',
      dateFin: '',
      statut: 'ACTIVE',
      modePaiement: 'COMPTE_BANCAIRE',
      renouvellementAuto: false
    };
    this.selectedAbonnement = null;
    this.isEditing = false;
    this.error = '';
  }

  // 🔹 Obtenir la classe CSS pour le statut
  getStatutClass(statut: string): string {
    switch (statut) {
      case 'ACTIVE': return 'badge-success';
      case 'SUSPENDU': return 'badge-warning';
      case 'ANNULE': return 'badge-danger';
      case 'EXPIRE': return 'badge-secondary';
      default: return 'badge-primary';
    }
  }

  // 🔹 Formater la date
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
>>>>>>> 4c7b750 (Added Subscription Module (backoffice))
}
