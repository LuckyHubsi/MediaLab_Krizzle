import { StyleSheet, Image, Platform } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { IconTopRight } from "@/components/ui/IconKriz/IconTopRight";

export default function TabTwoScreen() {
  return (
    <SafeAreaView>
      <ThemedView>
        <IconTopRight>
          <Image
            source={require("@/assets/images/kriz.png")}
            style={{ width: 30, height: 32 }}
          />
        </IconTopRight>
        <ThemedText fontSize="xl" fontWeight="bold">
          Archive
        </ThemedText>
        <ThemedText>Lorem ipsum</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}
