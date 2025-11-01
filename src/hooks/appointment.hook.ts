import { IAppointment } from "@/models/appointment.model";
import { UpdateMode } from "@/models/update-mode.enum";
import {
  setAppointment,
  setAppointmentUpdateMode,
} from "@/store/slice/appointment.slice";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

export const useAppointment = () => {
  const appointments = useSelector(
    (state: RootState) => state.appointments.appointments
  );
  const isLoading = useSelector<RootState, boolean>(
    (state) => state.appointments.isLoading
  );
  const appointment = useSelector<RootState, IAppointment>(
    (state) => state.appointments.appointment
  );
  const updateMode = useSelector<RootState, UpdateMode>(
    (state) => state.appointments.updateMode
  );
  const dispatch = useDispatch();

  const setSelectedAppointment = (appointment: IAppointment) => {
    dispatch(setAppointment(appointment));
  };

  const setUpdateMode = (updateMode: UpdateMode) => {
    dispatch(setAppointmentUpdateMode(updateMode));
  };

  const addAppointment = async (appointment: IAppointment) => {};

  const editAppointment = async (appointment: IAppointment) => {};

  return {
    appointments,
    appointment,
    isLoading,
    updateMode,
    setSelectedAppointment,
    setUpdateMode,
    addAppointment,
    editAppointment,
  };
};
