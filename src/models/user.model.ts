import { IBaseState } from "./base-state.model";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "employee" | "user";
  avatar?: string;
  department?: string;
  phone?: string;
  status: "active" | "inactive" | "pending";
  joinedDate: string;
}

export interface IUserState extends IBaseState {
  users: IUser[];
  user: IUser;
  currentUser: IUser;
  isAuthenticated: boolean;
}

export const emptyUser: IUser = {
  avatar: "",
  id: "",
  name: "",
  email: "",
  department: "",
  joinedDate: "",
  phone: "",
  status: "inactive",
  role: "admin",
};
