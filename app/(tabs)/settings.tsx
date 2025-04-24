import { ThemedText } from "@/components/ThemedText";
import { IconTopRight } from "@/components/ui/IconTopRight/IconTopRight";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";

export default function TabThreeScreen() {
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
          Settings
        </ThemedText>
        <ThemedText>Lorem ipsum</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}
