import React, { createContext, useContext, useState } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

export type ThemeOption = "light" | "dark" | "system";

type UserThemeContextType = {
  userTheme: ThemeOption;
  setUserTheme: (theme: ThemeOption) => void;
};

const UserThemeContext = createContext<UserThemeContextType | undefined>(
  undefined,
);

export function UserThemeProvider({ children }: { children: React.ReactNode }) {
  const [userTheme, setUserTheme] = useState<ThemeOption>("system");

  return (
    <UserThemeContext.Provider value={{ userTheme, setUserTheme }}>
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
