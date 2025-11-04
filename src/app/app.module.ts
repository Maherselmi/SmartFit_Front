import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ListeClientComponent } from './BackOffice/Gestion_Client/liste-client/liste-client.component';
import { ListeNutritionnelleComponent } from './BackOffice/Gestion_Nutritionnelle/liste-nutritionnelle/liste-nutritionnelle.component';
import { ListePlanningComponent } from './BackOffice/Gestion_Planning/liste-planning/liste-planning.component';
// ✅ Import du module FullCalendar
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarComponent } from './BackOffice/Gestion_Planning/calendar/calendar.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { SignupComponent } from './BackOffice/signup/signup/signup.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { SigninComponent } from './BackOffice/signin/signin/signin.component';
import {IndexComponent} from "./FrontOffice/index/index.component";
import {PlanningsComponent} from "./FrontOffice/PlanningsClient/plannings/plannings.component";
import {FitnessProgressionComponent} from "./FrontOffice/fitness-progression/fitness-progression.component";
import {ClientFormComponent} from "./FrontOffice/clientform/clientform.component";
import {NgOptimizedImage} from "@angular/common";
import {
  ListeAbonnementsComponent
} from "./BackOffice/Gestion_Abonnements/liste-abonnements/liste-abonnements.component";
import {
  SubscriptionRecommendationComponent
} from "./FrontOffice/subscription-recommendation/subscription-recommendation.component";
import {Dashboard360Component} from "./BackOffice/Gestion_Statistiques/dashboard-360/dashboard-360.component";
import {ChatCoachComponent} from "./FrontOffice/Client/chat-coach/chat-coach.component";
import {CoachListComponent} from "./BackOffice/Gestion_Coachs/liste-coachs/liste-coachs.component";
import {CoachFormComponent} from "./BackOffice/Gestion_Coachs/add-coach/add-coach.component";
import {EditCoachComponent} from "./BackOffice/Gestion_Coachs/edit-coach/edit-coach.component";
import {ChatComponent} from "./FrontOffice/chat/chat.component";



@NgModule({
  declarations: [
    AppComponent,
    ListeClientComponent,
    ListeNutritionnelleComponent,
    ListePlanningComponent,
    ListeAbonnementsComponent,
    CalendarComponent,
    SignupComponent,
    SigninComponent,
    IndexComponent,
    PlanningsComponent,
    FitnessProgressionComponent,
    SubscriptionRecommendationComponent,
    ClientFormComponent,
    CoachListComponent,
    CoachFormComponent,
    EditCoachComponent,
    ChatComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FullCalendarModule,
    HttpClientModule,
    FormsModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    Dashboard360Component,
    ChatCoachComponent,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
