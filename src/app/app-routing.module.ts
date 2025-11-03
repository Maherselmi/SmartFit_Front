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
import {CalendarComponent} from "./BackOffice/Gestion_Planning/calendar/calendar.component";
import {SignupComponent} from "./BackOffice/signup/signup/signup.component";
import {SigninComponent} from "./BackOffice/signin/signin/signin.component";
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import {IndexComponent} from "./FrontOffice/index/index.component";
import {PlanningsComponent} from "./FrontOffice/PlanningsClient/plannings/plannings.component";
import {FitnessProgressionComponent} from "./FrontOffice/fitness-progression/fitness-progression.component";
import {ClientFormComponent} from "./FrontOffice/clientform/clientform.component";

const routes: Routes = [
  { path: 'Index', component: IndexComponent },
  { path: 'PlanningClient', component: PlanningsComponent },
  { path: 'FitnessProgression', component: FitnessProgressionComponent },
  { path: 'signin', component: SigninComponent },
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: 'Dashboard', component: ListeStatistiquesComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'chatbot', component: ChatbotComponent },
  { path: 'Liste-Client', component: ListeClientComponent },
  { path: 'Liste-Coaches', component: ListeCoachsComponent },
  { path: 'Liste-Planning', component: ListePlanningComponent },
  { path: 'Liste-Nutritionnelle', component: ListeNutritionnelleComponent },
  { path: 'Liste-Abonnements', component: ListeAbonnementsComponent },
  { path: 'ClientForm', component: ClientFormComponent },







];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
