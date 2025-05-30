import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import OnboardingBackground from "./OnboardingBackground/OnboardingBackground";

export default function Step1() {
  const backgroundHeight = 92;
  return (
    <ThemedView>
      <OnboardingBackground
        imageSourceLight={require("@/assets/images/onboardingLight1.png")}
        imageSourceDark={require("@/assets/images/onboardingDark1.png")}
        heightPercent={backgroundHeight}
      />
    </ThemedView>
  );
}
