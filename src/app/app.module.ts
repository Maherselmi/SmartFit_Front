import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ListeClientComponent } from './BackOffice/Gestion_Client/liste-client/liste-client.component';
import { ListeCoachsComponent } from './BackOffice/Gestion_Coachs/liste-coachs/liste-coachs.component';
import { ListeNutritionnelleComponent } from './BackOffice/Gestion_Nutritionnelle/liste-nutritionnelle/liste-nutritionnelle.component';
import { ListePlanningComponent } from './BackOffice/Gestion_Planning/liste-planning/liste-planning.component';
import { ListeStatistiquesComponent } from './BackOffice/Gestion_Statistiques/liste-statistiques/liste-statistiques.component';
import { ListeAbonnementsComponent } from './BackOffice/Gestion_Abonnements/liste-abonnements/liste-abonnements.component';

// ✅ Import du module FullCalendar
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarComponent } from './BackOffice/Gestion_Planning/calendar/calendar.component';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { SignupComponent } from './BackOffice/signup/signup/signup.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { SigninComponent } from './BackOffice/signin/signin/signin.component';
import { IndexComponent } from './FrontOffice/index/index.component';
import { PlanningsComponent } from './FrontOffice/PlanningsClient/plannings/plannings.component';
import {NgOptimizedImage} from "@angular/common";
import { FitnessProgressionComponent } from './FrontOffice/fitness-progression/fitness-progression.component';
import { ClientFormComponent } from './FrontOffice/clientform/clientform.component';



@NgModule({
  declarations: [
    AppComponent,
    ListeAbonnementsComponent,
    ListeClientComponent,
    ListeCoachsComponent,
    ListeNutritionnelleComponent,
    ListePlanningComponent,
    ListeStatistiquesComponent,
    CalendarComponent,
    SignupComponent,
    SigninComponent,
    IndexComponent,
    PlanningsComponent,
    FitnessProgressionComponent,
    ClientFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FullCalendarModule,
    HttpClientModule,
    FormsModule,
    NgOptimizedImage,
    ReactiveFormsModule,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
