import { useFocusEffect } from "expo-router";
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
import { useCallback, useRef } from "react";

/**
 * AppearanceScreen component allows users to select their preferred theme (light/dark/system).
 */

export default function AppearanceScreen() {
  const { userTheme, saveUserTheme, isLoading } = useUserTheme();
  const systemColorScheme = useColorScheme() ?? "light";
  const selectedTheme = userTheme === "system" ? systemColorScheme : userTheme;
  const headerRef = useRef<View | null>(null);

  /**
   * sets the screenreader focus to the header after mount
   */
  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(() => {
        const node = findNodeHandle(headerRef.current);
        if (node) {
          AccessibilityInfo.setAccessibilityFocus(node);
        }
      }, 100);

      return () => clearTimeout(timeout);
    }, []),
  );

  // If the user theme is loading, show a loading indicator
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

  /**
   * Components used:
   * - CustomStyledHeader: A custom header component for the screen.
   * - ThemedView: A themed view component that adapts to the current theme.
   * - ThemedText: A themed text component that adapts to the current theme.
   * - Card: A card component for displaying the theme selector.
   * - ThemeSelector: A component that allows users to select their preferred theme.
   */
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
