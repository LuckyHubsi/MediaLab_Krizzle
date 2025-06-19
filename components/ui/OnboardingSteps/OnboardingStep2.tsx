import { ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import OnboardingBackground from "./OnboardingBackground/OnboardingBackground";

/**
 * Component for the second step of the onboarding process.
 */

export default function Step2() {
  const backgroundHeight = 61;
  return (
    <ThemedView>
      <OnboardingBackground
        imageSourceLight={require("@/assets/images/onboardingLight2.png")}
        imageSourceDark={require("@/assets/images/onboardingDark2.png")}
        heightPercent={backgroundHeight}
        hint="Depicts the widget creation screen for a note. Illustrates the customizability through showing differently coloured page widgets"
      />
      <ScrollView style={{ gap: 8, top: "60%", height: "28%", flexGrow: 0 }}>
        <ThemedText
          fontWeight="bold"
          fontSize="l"
          accessible={true}
          accessibilityRole="header"
        >
          Customize your Home Screen with Widgets
        </ThemedText>

        <ThemedText
          fontWeight="light"
          fontSize="regular"
          accessible={true}
          accessibilityRole="text"
        >
          Fully customize your Home Screen with all the Note or Collection
          Widgets that you desire. Enter a text, choose a tag, a color or an
          icon.
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}
