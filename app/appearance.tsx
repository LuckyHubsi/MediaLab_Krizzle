import { router } from "expo-router";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { Card } from "@/components/ui/Card/Card";
import { ThemeSelector } from "@/components/ui/ThemeSelector/ThemeSelector";
import { useUserTheme } from "@/context/ThemeContext";
import {
  useColorScheme,
  ActivityIndicator,
  View,
  AccessibilityInfo,
  findNodeHandle,
} from "react-native";
import { useEffect, useRef } from "react";

export default function AppearanceScreen() {
  const { userTheme, saveUserTheme, isLoading } = useUserTheme();
  const systemColorScheme = useColorScheme() ?? "light";
  const selectedTheme = userTheme === "system" ? systemColorScheme : userTheme;
  const headerRef = useRef<View | null>(null);

  /**
   * sets the screenreader focus to the header after mount
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      const node = findNodeHandle(headerRef.current);
      if (node) {
        AccessibilityInfo.setAccessibilityFocus(node);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView>
        <CustomStyledHeader
          title={"Appearance"}
          iconName="more-horiz"
          headerRef={headerRef}
        />
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
      <CustomStyledHeader
        title={"Appearance"}
        iconName="more-horiz"
        headerRef={headerRef}
      />
      <ThemedView>
        <ThemedText
          fontSize="regular"
          fontWeight="regular"
          accessible={true}
          accessibilityRole="header"
        >
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
