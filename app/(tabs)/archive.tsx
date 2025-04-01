import { StyleSheet, Image, Platform } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";

export default function TabTwoScreen() {
  return (
    <SafeAreaView>
      <ThemedView>
        <ThemedText fontSize="xl" fontWeight="bold">
          Archive
        </ThemedText>
        <ThemedText>Lorem ipsum</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}
