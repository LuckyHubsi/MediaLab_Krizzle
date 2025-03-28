import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabThreeScreen() {
  return (
    <SafeAreaView>
      <ThemedText fontSize="xxl" fontWeight="bold">
        Settings
      </ThemedText>
      <ThemedText>Lorem ipsum</ThemedText>
    </SafeAreaView>
  );
}
