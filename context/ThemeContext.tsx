import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import { themeStorage } from "@/backend/service/themeStorage";

/**
 * Context for managing user theme preferences.
 * This context allows components to access and modify the user's preferred color scheme: light, dark, or system default.
 * It provides methods to save the user's theme choice, reset to the system default.
 */

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

  // Load the user's saved theme preference from storage when the component mounts
  // If no preference is saved, it defaults to "system"
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

  /**
   * Function to save the user's preferred theme.
   * @param theme: ColorSchemeOption - The theme to save, can be "light", "dark", or "system".
   */
  const saveUserTheme = async (theme: ColorSchemeOption) => {
    try {
      await themeStorage.saveTheme(theme);
      setUserTheme(theme);
    } catch (error) {
      console.error("Failed to save preferred theme:", error);
    }
  };

  /**
   * Function to reset the user's theme preference to the system default.
   */
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

/**
 * Hook to access the UserThemeContext.
 * This hook provides the current user's theme preference and methods to change it.
 */
export function useUserTheme() {
  const context = useContext(UserThemeContext);
  if (!context) {
    throw new Error("useUserTheme must be used inside a UserThemeProvider");
  }
  return context;
}

/**
 * Hook to determine the active color scheme based on user preference and system settings.
 * It returns "light" or "dark" based on the user's theme choice or the system's color scheme.
 */
export function useActiveColorScheme(): "light" | "dark" {
  const { userTheme } = useUserTheme();
  const systemColorScheme = useSystemColorScheme() ?? "light";
  return userTheme === "system" ? systemColorScheme : userTheme;
}
