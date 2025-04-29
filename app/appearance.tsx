import { router } from "expo-router";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SettingsLink } from "@/components/ui/SettingsLink/SettingsLink";
import { Header } from "@/components/ui/Header/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { Card } from "@/components/ui/Card/Card";
import { ThemeSelector } from "@/components/ui/ThemeSelector/ThemeSelector";
import { useState } from "react";
import { useUserTheme } from "@/context/ThemeContext";
import { useColorScheme } from "react-native";

export default function AppearanceScreen() {
  const { userTheme, setUserTheme } = useUserTheme();
  const systemColorScheme = useColorScheme() ?? "light";
  const selectedTheme = userTheme === "system" ? systemColorScheme : userTheme;
  return (
    <SafeAreaView>
      <CustomStyledHeader title={"Appearance"} iconName="more-horiz" />
      <ThemedView>
        <ThemedText fontSize="regular" fontWeight="regular">
          Light/Dark Themes
        </ThemedText>
        <Card>
          <ThemeSelector
            selected={selectedTheme}
            onSelect={(theme) => setUserTheme(theme)}
          />
        </Card>
      </ThemedView>
    </SafeAreaView>
  );
}
