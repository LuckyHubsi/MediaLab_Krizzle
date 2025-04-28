import { router } from "expo-router";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SettingsLink } from "@/components/ui/SettingsLink/SettingsLink";
import { Header } from "@/components/ui/Header/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";

export default function AppearanceScreen() {
  return (
    <SafeAreaView>
      <CustomStyledHeader title={"Appearance"} iconName="more-horiz" />
      <ThemedView>
        <ThemedText fontSize="regular" fontWeight="regular">
          Appearance
        </ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}
