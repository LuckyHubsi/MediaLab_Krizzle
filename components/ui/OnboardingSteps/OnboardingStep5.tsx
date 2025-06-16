import { ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import OnboardingBackground from "./OnboardingBackground/OnboardingBackground";

/**
 * Component for the fifth step of the onboarding process.
 */

export default function Step5() {
  const backgroundHeight = 61;
  return (
    <ThemedView>
      <OnboardingBackground
        imageSourceLight={require("@/assets/images/onboardingLight5.png")}
        imageSourceDark={require("@/assets/images/onboardingDark5.png")}
        heightPercent={backgroundHeight}
      />
      <ScrollView style={{ gap: 8, top: "60%", height: "28%", flexGrow: 0 }}>
        <ThemedText fontWeight="bold" fontSize="l">
          Create Your Own Collection Templates
        </ThemedText>
        <ThemedText fontWeight="light" fontSize="regular">
          Set up your own structure for any type of collection. Choose the
          details you want to include and organize information your way.
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}
