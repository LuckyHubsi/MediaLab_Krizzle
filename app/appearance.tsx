import { router } from "expo-router";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { Card } from "@/components/ui/Card/Card";
import { ThemeSelector } from "@/components/ui/ThemeSelector/ThemeSelector";
import { useUserTheme } from "@/context/ThemeContext";
import { useColorScheme, ActivityIndicator } from "react-native";

export default function AppearanceScreen() {
  const { userTheme, saveUserTheme, isLoading } = useUserTheme();
  const systemColorScheme = useColorScheme() ?? "light";
  const selectedTheme = userTheme === "system" ? systemColorScheme : userTheme;

  if (isLoading) {
    return (
      <SafeAreaView>
        <CustomStyledHeader title={"Appearance"} iconName="more-horiz" />
        <ThemedView
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <ActivityIndicator size="large" />
        </ThemedView>
      </SafeAreaView>
    );
  }

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
            onSelect={(theme) => saveUserTheme(theme)}
          />
        </Card>
      </ThemedView>
    </SafeAreaView>
  );
}
