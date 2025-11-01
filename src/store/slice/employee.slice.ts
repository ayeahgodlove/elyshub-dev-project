import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  IEmployee,
  IEmployeeState,
  emptyEmployee,
} from "@/models/employee.model";
import { employees } from "@/data/employee.data";
import { UpdateMode } from "@/models/update-mode.enum";

const initialState: IEmployeeState = {
  employees,
  employee: emptyEmployee,
  errors: "",
  isLoading: false,
  updateMode: UpdateMode.NONE,
};

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    addEmployee: (state, action: PayloadAction<IEmployee>) => {
      state.employees = [...state.employees, action.payload];
      state.updateMode = UpdateMode.ADD;
    },
    updateEmployee: (state, action: PayloadAction<IEmployee>) => {
      state.employees = state.employees.map((employee) => {
        return employee.id === action.payload.id ? action.payload : employee;
      });
      state.updateMode = UpdateMode.EDIT;
    },
    deleteEmployee: (state, action: PayloadAction<string>) => {
      state.employees = state.employees.filter(
        (apt) => apt.id !== action.payload
      );
      state.updateMode = UpdateMode.DELETE;
    },
    setEmployee: (state, action: PayloadAction<IEmployee>) => {
      state.employee = action.payload;
    },
    setEmployeeUpdateMode: (state, action: PayloadAction<UpdateMode>) => {
      state.updateMode = action.payload;
    },
    clearEmployees: (state) => {
      state.employees = [];
    },
  },
});

export const {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  setEmployee,
  clearEmployees,
  setEmployeeUpdateMode,
} = employeeSlice.actions;

const reducer = employeeSlice.reducer;
export { reducer as employeeReducer };
