import { ScrollView } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import OnboardingBackground from "./OnboardingBackground/OnboardingBackground";

/**
 * Component for the fourth step of the onboarding process.
 */

export default function Step4() {
  const backgroundHeight = 61;
  return (
    <ThemedView>
      <OnboardingBackground
        imageSourceLight={require("@/assets/images/onboardingLight4.png")}
        imageSourceDark={require("@/assets/images/onboardingDark4.png")}
        heightPercent={backgroundHeight}
        hint="Depicts a collection screen for a collection called Food Spots with a shopping knife and fork icon. Collection includes visible lists called Vienna, Tokyo, Seoul and London. List Vienna is selected. The item previews include the food spot name, a description and as well asan examplatory image."
      />
      <ScrollView style={{ gap: 8, top: "60%", height: "28%", flexGrow: 0 }}>
        <ThemedText
          fontWeight="bold"
          fontSize="l"
          accessible={true}
          accessibilityRole="header"
        >
          Keep Everything in One Place with Collections
        </ThemedText>
        <ThemedText
          fontWeight="light"
          fontSize="regular"
          accessible={true}
          accessibilityRole="text"
        >
          Collections let you group favorite places, items, or ideas in one
          simple space. Organize them into Lists like cities or&nbsp;categories.
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}
