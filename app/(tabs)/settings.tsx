import { ThemedText } from "@/components/ThemedText";
import { IconTopRight } from "@/components/ui/IconTopRight/IconTopRight";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, TouchableOpacity, View } from "react-native";
import { SettingsLink } from "@/components/ui/SettingsLink/SettingsLink";
import { resetDatabase } from "@/backend/service/DatabaseReset";
import { Button } from "@/components/ui/Button/Button";
import { router } from "expo-router";

export default function TabThreeScreen() {
  return (
    <SafeAreaView>
      <ThemedView>
        <IconTopRight onPress={() => router.push({ pathname: "/faq" })}>
          <Image
            source={require("@/assets/images/kriz.png")}
            style={{ width: 30, height: 32 }}
          />
        </IconTopRight>

        <ThemedText fontSize="xl" fontWeight="bold">
          Menu
        </ThemedText>
        <View style={{ gap: 6 }}>
          <SettingsLink label="Appearance" href="/appearance" iconName="tune" />
          <SettingsLink
            label="Tag Management"
            href="/tagManagement"
            iconName="local-offer"
          />
          <SettingsLink
            label="Archive"
            href="/archivePage"
            iconName="archive"
          />
          <SettingsLink
            label="Frequently Asked Questions"
            href="/faq"
            iconName="help-outline"
          />
          <SettingsLink
            label="Reset Data"
            href="/resetDatabase"
            iconName="delete-forever"
          />
          <SettingsLink
            label="Onboarding"
            href="/onboardingScreen"
            iconName="restart-alt"
          />
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
