import { users } from "@/data/user.data";
import { UpdateMode } from "@/models/update-mode.enum";
import { emptyUser, IUser, IUserState } from "@/models/user.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IUserState = {
  users,
  currentUser: emptyUser,
  user: emptyUser,
  isAuthenticated: false,
  isLoading: false,
  updateMode: UpdateMode.NONE,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<IUser>) => {
      state.users = [...state.users, action.payload];
      state.updateMode = UpdateMode.ADD;
    },
    updateUser: (state, action: PayloadAction<IUser>) => {
      state.users = state.users.map((user) => {
        return user.id === action.payload.id ? action.payload : user;
      });
      state.updateMode = UpdateMode.EDIT;
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
      state.updateMode = UpdateMode.DELETE;
    },
    setCurrentUser: (state, action: PayloadAction<IUser>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = action.payload !== null;
    },
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    updateUserStatus: (
      state,
      action: PayloadAction<{ id: string; status: IUser["status"] }>
    ) => {
      const user = state.users.find((u) => u.id === action.payload.id);
      if (user) {
        user.status = action.payload.status;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.currentUser = emptyUser;
      state.isAuthenticated = false;
    },
    clearUsers: (state) => {
      state.users = [];
    },
  },
});

export const {
  addUser,
  updateUser,
  deleteUser,
  setCurrentUser,
  setUser,
  updateUserStatus,
  setLoading,
  logout,
  clearUsers,
} = userSlice.actions;

const reducer = userSlice.reducer;
export { reducer as userReducer };
