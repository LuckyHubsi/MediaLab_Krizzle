import { ThemedText } from "@/components/ThemedText";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import FAQSection from "@/components/ui/FAQSection/FAQSection";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { Platform, SafeAreaView, StatusBar, View } from "react-native";

export default function onboardingScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <CustomStyledHeader title="FAQ Kriz" />
      </View>
      <ThemedView style={{ flex: 1 }}>
        <ThemedText fontWeight="bold" colorVariant="primary">
          Onboarding
        </ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}
