import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  ListeStatistiquesComponent
} from "./BackOffice/Gestion_Statistiques/liste-statistiques/liste-statistiques.component";
import {ListeClientComponent} from "./BackOffice/Gestion_Client/liste-client/liste-client.component";
import {ListeCoachsComponent} from "./BackOffice/Gestion_Coachs/liste-coachs/liste-coachs.component";
import {ListePlanningComponent} from "./BackOffice/Gestion_Planning/liste-planning/liste-planning.component";
import {
  ListeNutritionnelleComponent
} from "./BackOffice/Gestion_Nutritionnelle/liste-nutritionnelle/liste-nutritionnelle.component";
import {
  ListeAbonnementsComponent
} from "./BackOffice/Gestion_Abonnements/liste-abonnements/liste-abonnements.component";

const routes: Routes = [
  { path: 'Dashboard', component: ListeStatistiquesComponent },
  { path: 'Liste-Client', component: ListeClientComponent },
  { path: 'Liste-Coaches', component: ListeCoachsComponent },
  { path: 'Liste-Planning', component: ListePlanningComponent },
  { path: 'Liste-Nutritionnelle', component: ListeNutritionnelleComponent },
  { path: 'Liste-Abonnements', component: ListeAbonnementsComponent },






];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
