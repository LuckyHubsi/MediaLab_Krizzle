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

import { useColorScheme } from "@/hooks/useColorScheme";

import {
  Lexend_300Light,
  Lexend_400Regular,
  Lexend_600SemiBold,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import { ThemedText } from "@/components/ThemedText";

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

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="createNote"
          options={{
            headerTitle: "",
            headerLeft: ({ canGoBack }) => {
              const navigation = useNavigation();
              return canGoBack ? (
                <>
                  <ThemedText
                    fontSize="xl"
                    fontWeight="regular"
                    onPress={() => navigation.goBack()}
                  >
                    {"<"} Create a Note
                  </ThemedText>
                </>
              ) : null;
            },
            headerTintColor: "black",
            headerBackTitleStyle: {
              fontSize: 24,
            },
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
