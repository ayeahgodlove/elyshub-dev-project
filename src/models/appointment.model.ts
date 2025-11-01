import { IBaseState } from "./base-state.model";

export interface IAppointment {
  id: string;
  title: string;
  participants: string;
  time: string;
  duration: number;
  day: number;
  startHour: number;
  location: string;
  color: string;
  type?: string;
  description?: string;
  status?: "scheduled" | "completed" | "cancelled" | "rescheduled";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAppointmentState extends IBaseState {
  appointments: IAppointment[];
  appointment: IAppointment;
}

export const emptyAppointment: IAppointment = {
  id: "",
  title: "",
  participants: "",
  time: "",
  duration: 0,
  day: 0,
  startHour: 0,
  location: "",
  color: "",
  description: "",
  status: "completed",
  type: "",
  updatedAt: new Date(),
  createdAt: new Date(),
};
