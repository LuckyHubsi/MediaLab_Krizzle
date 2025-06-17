import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import OnboardingBackground from "./OnboardingBackground/OnboardingBackground";

/**
 * Component for the first step of the onboarding process.
 */

export default function Step1() {
  const backgroundHeight = 87;
  return (
    <ThemedView>
      <OnboardingBackground
        imageSourceLight={require("@/assets/images/onboardingLight1.png")}
        imageSourceDark={require("@/assets/images/onboardingDark1.png")}
        heightPercent={backgroundHeight}
        hint="Starting onboarding. The krizzle way to organize your ideas"
      />
    </ThemedView>
  );
}
