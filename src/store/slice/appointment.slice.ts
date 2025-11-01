import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  emptyAppointment,
  IAppointment,
  IAppointmentState,
} from "@/models/appointment.model";
import { appointments } from "@/data/appointment.data";
import { UpdateMode } from "@/models/update-mode.enum";

const initialState: IAppointmentState = {
  appointments,
  appointment: emptyAppointment,
  isLoading: false,
  updateMode: UpdateMode.NONE,
  errors: "",
};

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    addAppointment: (state, action: PayloadAction<IAppointment>) => {
      state.appointments = [...state.appointments, action.payload];
      state.updateMode = UpdateMode.ADD;
    },
    updateAppointment: (state, action: PayloadAction<IAppointment>) => {
      state.appointments = state.appointments.map((appointment) => {
        return appointment.id === action.payload.id
          ? action.payload
          : appointment;
      });
      state.updateMode = UpdateMode.EDIT;
    },
    deleteAppointment: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter(
        (apt) => apt.id !== action.payload
      );
      state.updateMode = UpdateMode.DELETE;
    },
    setAppointment: (state, action: PayloadAction<IAppointment>) => {
      state.appointment = action.payload;
    },
    setAppointmentUpdateMode: (state, action: PayloadAction<UpdateMode>) => {
      state.updateMode = action.payload;
    },
    clearAppointments: (state) => {
      state.appointments = [];
    },
  },
});

export const {
  addAppointment,
  updateAppointment,
  deleteAppointment,
  setAppointment,
  clearAppointments,
  setAppointmentUpdateMode,
} = appointmentSlice.actions;

const reducer = appointmentSlice.reducer;
export { reducer as appointmentReducer };
