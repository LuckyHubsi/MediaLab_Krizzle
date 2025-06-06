import AsyncStorage from "@react-native-async-storage/async-storage";
import { ColorSchemeOption } from "@/context/ThemeContext";

const THEME_STORAGE_KEY = "user-theme-preference";

export const themeStorage = {
  saveTheme: async (theme: ColorSchemeOption): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
      return true;
    } catch (error) {
      console.error("Failed to save theme preference:", error);
      return false;
    }
  },

  loadTheme: async (): Promise<ColorSchemeOption | null> => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      return savedTheme as ColorSchemeOption | null;
    } catch (error) {
      console.error("Failed to load theme preference:", error);
      return null;
    }
  },

  clearTheme: async (): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(THEME_STORAGE_KEY);
      return true;
    } catch (error) {
      console.error("Failed to clear theme preference:", error);
      return false;
    }
  },
};
