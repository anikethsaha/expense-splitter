import { User } from "src/models/user";
import { create } from "zustand";

type UserState = {
  user: User | null;

  setUser: (user: User | null) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null,

  setUser: (user: User | null) =>
    set({
      user,
    }),

  clearUser: () =>
    set({
      user: null,
    }),
}));

export const useLoggedInUser = () => useUserStore((state) => state.user);
