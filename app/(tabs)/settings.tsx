import { ThemedText } from "@/components/ThemedText";
import { IconTopRight } from "@/components/ui/IconTopRight/IconTopRight";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AccessibilityInfo,
  findNodeHandle,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SettingsLink } from "@/components/ui/SettingsLink/SettingsLink";
import { resetDatabase } from "@/backend/service/DatabaseReset";
import { Button } from "@/components/ui/Button/Button";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef } from "react";

export default function TabThreeScreen() {
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

  return (
    <SafeAreaView>
      <ThemedView>
        <IconTopRight onPress={() => router.push({ pathname: "/faq" })}>
          <Image
            source={require("@/assets/images/kriz.png")}
            style={{ width: 30, height: 32 }}
          />
        </IconTopRight>

        <ThemedText
          fontSize="xl"
          fontWeight="bold"
          accessible={true}
          accessibilityRole="header"
          accessibilityLiveRegion="polite"
          optionalRef={headerRef}
        >
          Menu
        </ThemedText>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={{ gap: 6, paddingBottom: 10 }}
              showsVerticalScrollIndicator={false}
              accessible={true}
              accessibilityRole="menu"
            >
              <SettingsLink
                label="Appearance"
                href="/appearance"
                iconName="tune"
                accessHint="Opens the Page for Theme Selection"
              />
              <SettingsLink
                label="Tag Management"
                href="/tagManagement"
                iconName="local-offer"
                accessHint="Opens the Page for Tag Management"
              />
              <SettingsLink
                label="Archive"
                href="/archivePage"
                iconName="archive"
                accessHint="Opens the Archived Page"
              />
              <SettingsLink
                label="Frequently Asked Questions"
                href="/faq"
                iconName="help-outline"
                accessHint="Opens the FAQ Page"
              />
              <SettingsLink
                label="Reset Data"
                href="/resetDatabase"
                iconName="delete-forever"
                accessHint="Opens the Page for Data Resetting"
              />
              <SettingsLink
                label="Onboarding"
                href="/onboardingScreen"
                iconName="restart-alt"
                accessHint="Starts the Onboarding"
              />
              <SettingsLink
                label="Visit Website"
                href="https://krizzle-website.vercel.app/"
                iconName="language"
                accessHint="Opens the Link to the krizzle website"
              />
            </ScrollView>
          </View>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
