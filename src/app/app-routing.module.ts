import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {ListeClientComponent} from "./BackOffice/Gestion_Client/liste-client/liste-client.component";
import {ListePlanningComponent} from "./BackOffice/Gestion_Planning/liste-planning/liste-planning.component";
import {
  ListeNutritionnelleComponent
} from "./BackOffice/Gestion_Nutritionnelle/liste-nutritionnelle/liste-nutritionnelle.component";

import {SignupComponent} from "./BackOffice/signup/signup/signup.component";
import {SigninComponent} from "./BackOffice/signin/signin/signin.component";
import {IndexComponent} from "./FrontOffice/index/index.component";
import {PlanningsComponent} from "./FrontOffice/PlanningsClient/plannings/plannings.component";
import {FitnessProgressionComponent} from "./FrontOffice/fitness-progression/fitness-progression.component";
import {ClientFormComponent} from "./FrontOffice/clientform/clientform.component";
import {
  ListeAbonnementsComponent
} from "./BackOffice/Gestion_Abonnements/liste-abonnements/liste-abonnements.component";
import {
  SubscriptionRecommendationComponent
} from "./FrontOffice/subscription-recommendation/subscription-recommendation.component";
import {Dashboard360Component} from "./BackOffice/Gestion_Statistiques/dashboard-360/dashboard-360.component";
import {ChatCoachComponent} from "./FrontOffice/Client/chat-coach/chat-coach.component";
import {CoachFormComponent} from "./BackOffice/Gestion_Coachs/add-coach/add-coach.component";
import {EditCoachComponent} from "./BackOffice/Gestion_Coachs/edit-coach/edit-coach.component";
import {CoachListComponent} from "./BackOffice/Gestion_Coachs/liste-coachs/liste-coachs.component";
import {ChatComponent} from "./FrontOffice/chat/chat.component";


const routes: Routes = [
  { path: 'Index', component: IndexComponent },
  { path: 'PlanningClient', component: PlanningsComponent },

  { path: 'FitnessProgression', component: FitnessProgressionComponent },
  { path: 'signin', component: SigninComponent },
  { path: '', redirectTo: '/signin', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'Liste-Client', component: ListeClientComponent },
  { path: 'Liste-Planning', component: ListePlanningComponent },
  { path: 'Liste-Nutritionnelle', component: ListeNutritionnelleComponent },
  { path: 'ClientForm', component: ClientFormComponent },

  { path: 'ListAb', component: ListeAbonnementsComponent },
  { path: 'subscription-recommendation', component: SubscriptionRecommendationComponent },
  { path: 'Dashboard', component: Dashboard360Component },
  { path: 'chatchout', component: ChatCoachComponent },
  {path: 'CoachFormComponent', component: CoachFormComponent},
  {path:'EditCoach/:id', component: EditCoachComponent},
  {path:'ListeCoach', component:CoachListComponent},
  {path:'Chatgpt', component:ChatComponent}










];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
