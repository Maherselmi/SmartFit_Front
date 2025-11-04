import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Planning } from '../../../Models/Planning';
import { PlanningService } from '../../../services/planning.service';
import {AuthService} from "../../../services/signin.service";


@Component({
  selector: 'app-liste-planning',
  templateUrl: './liste-planning.component.html',
  styleUrls: ['./liste-planning.component.css']
})
export class ListePlanningComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: 'fr',
    allDaySlot: true,
    slotMinTime: '08:00:00',
    slotMaxTime: '18:00:00',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    buttonText: {
      today: 'aujourd\'hui',
      month: 'mois',
      week: 'semaine',
      day: 'jour'
    },
    events: [] // les événements seront chargés dynamiquement
  };

  constructor(private planningService: PlanningService, private authService: AuthService // ✅ injecter ici
  ) {
  }

  ngOnInit(): void {
    this.loadPlannings();
  }

  loadPlannings(): void {
    this.planningService.getPlannings().subscribe((plannings: Planning[]) => {
      // Conversion des plannings pour FullCalendar
      this.calendarOptions.events = plannings.map(p => ({
        title: p.titre,
        start: p.dateDebut,
        end: p.dateFin,
        extendedProps: {
          description: p.description,
          coachId: p.coachId,
          clientId: p.clientId
        }
      }));
    });
  }
}
