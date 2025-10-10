import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListeClientComponent } from './BackOffice/Gestion_Client/liste-client/liste-client.component';
import { ListeCoachsComponent } from './BackOffice/Gestion_Coachs/liste-coachs/liste-coachs.component';
import { ListeNutritionnelleComponent } from './BackOffice/Gestion_Nutritionnelle/liste-nutritionnelle/liste-nutritionnelle.component';
import { ListePlanningComponent } from './BackOffice/Gestion_Planning/liste-planning/liste-planning.component';
import { ListeStatistiquesComponent } from './BackOffice/Gestion_Statistiques/liste-statistiques/liste-statistiques.component';
import {
  ListeAbonnementsComponent
} from "./BackOffice/Gestion_Abonnements/liste-abonnements/liste-abonnements.component";

@NgModule({
  declarations: [
    AppComponent,
    ListeAbonnementsComponent,
    ListeClientComponent,
    ListeCoachsComponent,
    ListeNutritionnelleComponent,
    ListePlanningComponent,
    ListeStatistiquesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
