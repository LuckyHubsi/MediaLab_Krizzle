import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import FAQSection from "@/components/ui/FAQSection/FAQSection";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { Platform, SafeAreaView, StatusBar, View } from "react-native";

/**
 * FAQScreen that displays a FAQ section with a custom header.
 */
export default function FaqScreen() {
  /**
   * Components used:
   *
   * - CustomStyledHeader: A custom header component with a title.
   * - FAQSection: A section that displays frequently asked questions.
   * - ThemedView: A themed view component that applies the current theme.
   */
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
        <FAQSection />
      </ThemedView>
    </SafeAreaView>
  );
}
