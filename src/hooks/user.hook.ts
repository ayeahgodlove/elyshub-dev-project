import { IUser } from "@/models/user.model";
import { UpdateMode } from "@/models/update-mode.enum";
import {
  setUser,
} from "@/store/slice/user.slice";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

export const useUser = () => {
  const users = useSelector(
    (state: RootState) => state.users.users
  );
  const isLoading = useSelector<RootState, boolean>(
    (state) => state.users.isLoading
  );
  const user = useSelector<RootState, IUser>(
    (state) => state.users.user
  );
  const updateMode = useSelector<RootState, UpdateMode>(
    (state) => state.users.updateMode
  );
  const dispatch = useDispatch();

  const setSelectedUser = (user: IUser) => {
    dispatch(setUser(user));
  };

  const addUser = async (user: IUser) => {};

  const editUser = async (user: IUser) => {};

  return {
    users,
    user,
    isLoading,
    updateMode,
    setSelectedUser,
    addUser,
    editUser,
  };
};
