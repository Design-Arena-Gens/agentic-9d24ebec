"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ThemeName = "light" | "dark" | "aqua";

const ThemeContext = createContext<{
  theme: ThemeName;
  setTheme: (value: ThemeName) => void;
}>({
  theme: "light",
  setTheme: () => undefined
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("aba-theme") as ThemeName | null;
    if (stored) {
      setThemeState(stored);
      document.documentElement.dataset.theme = stored;
    } else {
      document.documentElement.dataset.theme = "light";
    }
  }, []);

  const setTheme = (value: ThemeName) => {
    setThemeState(value);
    document.documentElement.dataset.theme = value;
    window.localStorage.setItem("aba-theme", value);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
