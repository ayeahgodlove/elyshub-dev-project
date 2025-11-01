import { configureStore } from "@reduxjs/toolkit";
import { appointmentReducer } from "./slice/appointment.slice";
import { employeeReducer } from "./slice/employee.slice";
import { userReducer } from "./slice/user.slice";

export const store = configureStore({
  reducer: {
    appointments: appointmentReducer,
    employees: employeeReducer,
    users: userReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
