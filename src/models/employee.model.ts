import { IBaseState } from "./base-state.model";

export interface IEmployee {
  id: string;
  name: string;
  email: string;
  category: string;
  reportTo: string;
  avatar: string;
  phone?: string;
  department?: string;
  position?: string;
  status?: "active" | "inactive" | "on-leave";
  joinedDate?: string;
  salary?: number;
}

export interface IEmployeeState extends IBaseState {
  employees: IEmployee[];
  employee: IEmployee;
}

export const emptyEmployee: IEmployee = {
  avatar: "",
  id: "",
  name: "",
  email: "",
  category: "",
  reportTo: "",
  department: "",
  joinedDate: "",
  phone: "",
  position: "",
  salary: 0,
  status: "inactive",
};
