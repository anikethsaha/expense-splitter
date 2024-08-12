import { create } from "zustand";

export enum ModeTheme {
  LIGHT = "LIGHT",
  DARK = "DARK",
}

type AppStore = {
  theme: ModeTheme;
  setTheme: (theme: ModeTheme) => void;
};

export const useAppStore = create<AppStore>((set) => ({
  theme: ModeTheme.LIGHT,
  setTheme: (theme) => set({ theme }),
}));

export const useAppTheme = () => useAppStore((state) => state.theme);
