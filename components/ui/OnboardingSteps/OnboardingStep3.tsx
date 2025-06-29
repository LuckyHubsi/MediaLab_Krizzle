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
        hint="Depicts a note screen for a note called Grocery List with a shopping cart icon. Illustrates different note formatting options such as headers, underlines, and checkboxes."
      />
      <ScrollView style={{ gap: 8, top: "60%", height: "28%", flexGrow: 0 }}>
        <ThemedText
          fontWeight="bold"
          fontSize="l"
          accessible={true}
          accessibilityRole="header"
        >
          Quickly capture what’s on&nbsp;your mind
        </ThemedText>
        <ThemedText
          fontWeight="light"
          fontSize="regular"
          accessible={true}
          accessibilityRole="text"
        >
          Open, write, done. Whether it’s a sudden thought, a task, or an idea -
          krizzle helps you jot it down in seconds, without getting in your way.
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}
