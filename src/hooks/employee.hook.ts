import { IEmployee } from "@/models/employee.model";
import { UpdateMode } from "@/models/update-mode.enum";
import {
  setEmployee,
  setEmployeeUpdateMode,
} from "@/store/slice/employee.slice";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

export const useEmployee = () => {
  const employees = useSelector(
    (state: RootState) => state.employees.employees
  );
  const isLoading = useSelector<RootState, boolean>(
    (state) => state.employees.isLoading
  );
  const employee = useSelector<RootState, IEmployee>(
    (state) => state.employees.employee
  );
  const updateMode = useSelector<RootState, UpdateMode>(
    (state) => state.employees.updateMode
  );
  const dispatch = useDispatch();

  const setSelectedEmployee = (employee: IEmployee) => {
    dispatch(setEmployee(employee));
  };

  const setUpdateMode = (updateMode: UpdateMode) => {
    dispatch(setEmployeeUpdateMode(updateMode));
  };

  const addEmployee = async (employee: IEmployee) => {};

  const editEmployee = async (employee: IEmployee) => {};

  return {
    employees,
    employee,
    isLoading,
    updateMode,
    setSelectedEmployee,
    setUpdateMode,
    addEmployee,
    editEmployee,
  };
};
