import { Image, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import OnboardingBackground from "./OnboardingBackground/OnboardingBackground";

export default function Step4() {
  const backgroundHeight = 65;
  return (
    <ThemedView>
      <OnboardingBackground
        imageSourceLight={require("@/assets/images/onboardingLight4.png")}
        imageSourceDark={require("@/assets/images/onboardingDark4.png")}
        heightPercent={backgroundHeight}
      />
      <View style={{ gap: 8, top: "65%" }}>
        <ThemedText fontWeight="bold" fontSize="l">
          Keep Everything in One Place with Collections
        </ThemedText>
        <ThemedText fontWeight="light" fontSize="regular">
          Collections let you group favorite places, items, or ideas in one
          simple space. Organize them into Lists like cities or&nbsp;categories.
        </ThemedText>
      </View>
    </ThemedView>
  );
}
