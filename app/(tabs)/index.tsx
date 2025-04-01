import { Image, StyleSheet, Platform } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme"; // Add this import
import { Colors } from "@/constants/Colors"; // Add this import
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import { Button } from "@/components/ui/Button/Button";

export default function HomeScreen() {
  const colorScheme = useColorScheme(); // light or dark
  const color = Colors[colorScheme || "light"].tint;

  return (
    <SafeAreaView>
      <ThemedView>
        <ThemedText fontSize="xl" fontWeight="bold">
          Home
        </ThemedText>
        <SearchBar
          placeholder="Search"
          onSearch={(query) => console.log(query)}
        />
        <Button
          color={Colors[colorScheme || "light"].tint}
          size="medium"
          onPress={() => console.log("Button clicked!")}
        >
          Start
        </Button>
      </ThemedView>
    </SafeAreaView>
  );
}
