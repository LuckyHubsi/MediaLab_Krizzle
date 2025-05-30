import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import OnboardingBackground from "./OnboardingBackground/OnboardingBackground";

export default function Step2() {
  const backgroundHeight = 61;
  return (
    <ThemedView>
      <OnboardingBackground
        imageSourceLight={require("@/assets/images/onboardingLight2.png")}
        imageSourceDark={require("@/assets/images/onboardingDark2.png")}
        heightPercent={backgroundHeight}
      />
      <View style={{ gap: 8, top: "60%" }}>
        <ThemedText fontWeight="bold" fontSize="l">
          Customize your Home Screen with Widgets
        </ThemedText>
        <ThemedText fontWeight="light" fontSize="regular">
          Fully customize your Home Screen with all the Note or Collection
          Widgets that you desire. Enter a text, choose a tag, a color or an
          icon.
        </ThemedText>
      </View>
    </ThemedView>
  );
}
