import { useEffect } from "react";
import { ModeTheme, useAppStore, useAppTheme } from "src/stores/App.store";

export const LOCAL_STORAGE_KEY = "darkMode";

export const useDarkMode = () => {
  const currentMode = useAppTheme();
  const setTheme = useAppStore((state) => state.setTheme);

  useEffect(() => {
    const darkMode = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (darkMode) {
      setTheme(darkMode as ModeTheme);
    }
  }, []);

  const setAppTheme = (isDarkMode: boolean) => {
    const theme = isDarkMode ? ModeTheme.DARK : ModeTheme.LIGHT;
    setTheme(theme);
    localStorage.setItem(LOCAL_STORAGE_KEY, theme);
  };

  return {
    isDarkMode: currentMode === ModeTheme.DARK,
    setAppTheme,
  };
};
