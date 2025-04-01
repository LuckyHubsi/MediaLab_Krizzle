import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabThreeScreen() {
  return (
    <SafeAreaView>
      <ThemedView>
        <ThemedText fontSize="xl" fontWeight="bold">
          Settings
        </ThemedText>
        <ThemedText>Lorem ipsum</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}
