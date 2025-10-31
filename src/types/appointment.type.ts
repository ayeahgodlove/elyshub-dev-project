export interface Appointment {
  id: string;
  title: string;
  participants: string
  time: string;
  duration: number;
  day: number;
  startHour: number;
  location: string;

  color: string;
  type?: string;
}
