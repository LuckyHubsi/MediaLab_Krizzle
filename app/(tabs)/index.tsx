import { Image, StyleSheet, Platform } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme"; // Add this import
import { Colors } from "@/constants/Colors"; // Add this import
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const colorScheme = useColorScheme(); // light or dark
  const color = Colors[colorScheme ?? "light"].tint;

  return (
    <SafeAreaView>
      <ThemedView>
        <ThemedText fontSize="regular" fontWeight="bold">
          Home
        </ThemedText>
        <IconSymbol name="person" size={32} color={color} />
      </ThemedView>
    </SafeAreaView>
  );
}
