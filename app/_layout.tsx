import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import {
  Lexend_300Light,
  Lexend_400Regular,
  Lexend_600SemiBold,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SQLiteProvider } from "expo-sqlite";
import { UserThemeProvider } from "@/context/ThemeContext";
import { SnackbarProvider } from "@/components/ui/Snackbar/Snackbar";
import { RepositoryProvider } from "@/context/RepositoryContext";
import { ServiceProvider } from "@/context/ServiceContext";
import * as ImagePicker from "expo-image-picker";

/**
 * RootLayout component that sets up the main layout of the app.
 * It includes theme management, font loading, and permission requests.
 */

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Load custom fonts
  const [loaded] = useFonts({
    Lexend_300Light,
    Lexend_400Regular,
    Lexend_600SemiBold,
    Lexend_700Bold,
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  //Hides the splash screen once the app has finished loading.
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Request permissions for camera and media library access
  useEffect(() => {
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

  // Ensure the app is ready to render before showing the UI and prevent flashing
  if (!loaded) return null;

  return (
    <UserThemeProvider>
      <SQLiteProvider
        databaseName="krizzle_local.db"
        assetSource={{
          assetId: require("../assets/database/krizzle_local.db"),
        }}
      >
        <RepositoryProvider>
          <ServiceProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <SnackbarProvider>
                <Stack>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="createNote"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="collectionPage"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="notePage"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="tagManagement"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="createCollection"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="editWidget"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="editCollectionLists"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="addCollectionItem"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="collectionItemPage"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="appearance"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="faq" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="editCollectionItem"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="archivePage"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="+not-found" />
                  <Stack.Screen
                    name="resetDatabase"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="folderPage"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="editCollectionTemplate"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="onboardingScreen"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                </Stack>
                <StatusBar style="auto" />
              </SnackbarProvider>
            </ThemeProvider>
          </ServiceProvider>
        </RepositoryProvider>
      </SQLiteProvider>
    </UserThemeProvider>
  );
}
