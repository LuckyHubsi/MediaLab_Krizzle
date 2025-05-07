import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeOption = "light" | "dark" | "system";
const THEME_STORAGE_KEY = "user-theme-preference";

type UserThemeContextType = {
  userTheme: ThemeOption;
  saveUserTheme: (theme: ThemeOption) => void;
  isLoading: boolean;
};

const UserThemeContext = createContext<UserThemeContextType | undefined>(
  undefined,
);

export function UserThemeProvider({ children }: { children: React.ReactNode }) {
  const [userTheme, setUserTheme] = useState<ThemeOption>("system");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setUserTheme(savedTheme as ThemeOption);
        }
      } catch (error) {
        console.error("Failed to load preferred theme:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedTheme();
  }, []);

  const saveUserTheme = async (theme: ThemeOption) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
      setUserTheme(theme);
    } catch (error) {
      console.error("Failed to save preferred theme:", error);
    }
  };

  return (
    <UserThemeContext.Provider value={{ userTheme, saveUserTheme, isLoading }}>
      {children}
    </UserThemeContext.Provider>
  );
}

export function useUserTheme() {
  const context = useContext(UserThemeContext);
  if (!context) {
    throw new Error("useUserTheme must be used inside a UserThemeProvider");
  }
  return context;
}

export function useActiveColorScheme(): "light" | "dark" {
  const { userTheme } = useUserTheme();
  const systemColorScheme = useSystemColorScheme() ?? "light";
  return userTheme === "system" ? systemColorScheme : userTheme;
}
