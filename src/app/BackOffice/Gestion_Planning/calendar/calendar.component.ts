import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {Planning} from "../../../Models/Planning";
import {PlanningService} from "../../../services/planning.service";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

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

  constructor(private planningService: PlanningService) { }

  ngOnInit(): void {
    this.loadPlannings();
  }

  loadPlannings(): void {
    this.planningService.getPlannings().subscribe((plannings: Planning[]) => {
      // Conversion des plannings en format FullCalendar
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
