import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import { themeStorage } from "@/utils/themeStorage";

export type ColorSchemeOption = "light" | "dark" | "system";
export type ColorSchemeProps = { colorScheme: "light" | "dark" };

type UserThemeContextType = {
  userTheme: ColorSchemeOption;
  saveUserTheme: (theme: ColorSchemeOption) => void;
  resetToSystemDefault: () => void;
  isLoading: boolean;
};

const UserThemeContext = createContext<UserThemeContextType | undefined>(
  undefined,
);

export function UserThemeProvider({ children }: { children: React.ReactNode }) {
  const [userTheme, setUserTheme] = useState<ColorSchemeOption>("system");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await themeStorage.loadTheme();
        if (savedTheme !== null) {
          setUserTheme(savedTheme as ColorSchemeOption);
        }
      } catch (error) {
        console.error("Failed to load preferred theme:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedTheme();
  }, []);

  const saveUserTheme = async (theme: ColorSchemeOption) => {
    try {
      await themeStorage.saveTheme(theme);
      setUserTheme(theme);
    } catch (error) {
      console.error("Failed to save preferred theme:", error);
    }
  };

  const resetToSystemDefault = async () => {
    const cleared = await themeStorage.clearTheme();
    if (cleared) {
      saveUserTheme("system");
    }
  };

  return (
    <UserThemeContext.Provider
      value={{ userTheme, saveUserTheme, resetToSystemDefault, isLoading }}
    >
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
