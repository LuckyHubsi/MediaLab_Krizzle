import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useNavigation } from "expo-router";
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
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SQLiteProvider } from "expo-sqlite";
import { UserThemeProvider } from "@/context/ThemeContext";
import { SnackbarProvider } from "@/components/ui/Snackbar/Snackbar";
import { RepositoryProvider } from "@/context/RepositoryContext";
import { ServiceProvider } from "@/context/ServiceContext";
import * as ImagePicker from "expo-image-picker";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Lexend_300Light,
    Lexend_400Regular,
    Lexend_600SemiBold,
    Lexend_700Bold,
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    (async () => {
      await ImagePicker.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    })();
  }, []);

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
