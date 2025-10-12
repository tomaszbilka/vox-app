import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  actualTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useColorScheme() ?? "light";
  const [theme, setTheme] = useState<Theme>("system");
  const [actualTheme, setActualTheme] = useState<"light" | "dark">(systemTheme);

  useEffect(() => {
    AsyncStorage.getItem("user-theme").then((saved) => {
      if (saved === "light" || saved === "dark" || saved === "system") {
        setTheme(saved);
      }
    });
  }, []);

  useEffect(() => {
    if (theme === "system") {
      setActualTheme(systemTheme);
    } else {
      setActualTheme(theme);
    }
  }, [theme, systemTheme]);

  const handleSetTheme = async (newTheme: Theme) => {
    setTheme(newTheme);
    await AsyncStorage.setItem("user-theme", newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        actualTheme,
        setTheme: handleSetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
