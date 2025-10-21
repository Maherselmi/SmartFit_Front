
export interface Planning {
  id: number;
  titre: string;
  description?: string;
  dateDebut: string; // ISO string pour FullCalendar
  dateFin: string;   // ISO string
  coachId: number;
  clientId: number;
}
