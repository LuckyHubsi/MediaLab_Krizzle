import { Image, StyleSheet, Platform } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import { Button } from "@/components/ui/Button/Button";
import { EmptyHome } from "@/components/emptyHome/emptyHome";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
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
        <EmptyHome />
      </ThemedView>
    </SafeAreaView>
  );
}
