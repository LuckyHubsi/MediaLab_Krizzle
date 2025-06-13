import { ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import OnboardingBackground from "./OnboardingBackground/OnboardingBackground";

/**
 * Component for the third step of the onboarding process.
 */

export default function Step3() {
  const backgroundHeight = 61;
  return (
    <ThemedView>
      <OnboardingBackground
        imageSourceLight={require("@/assets/images/onboardingLight3.png")}
        imageSourceDark={require("@/assets/images/onboardingDark3.png")}
        heightPercent={backgroundHeight}
      />
      <ScrollView style={{ gap: 8, top: "60%", height: "28%", flexGrow: 0 }}>
        <ThemedText fontWeight="bold" fontSize="l">
          Quickly capture what’s on&nbsp;your mind
        </ThemedText>
        <ThemedText fontWeight="light" fontSize="regular">
          Open, write, done. Whether it’s a sudden thought, a task, or an idea -
          krizzle helps you jot it down in seconds, without getting in your way.
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}
