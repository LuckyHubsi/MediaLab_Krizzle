import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import FAQSection from "@/components/ui/FAQSection/FAQSection";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { useRef, useEffect } from "react";
import {
  AccessibilityInfo,
  findNodeHandle,
  Platform,
  SafeAreaView,
  StatusBar,
  View,
} from "react-native";

/**
 * FAQScreen that displays a FAQ section with a custom header.
 */
export default function FaqScreen() {
  const headerRef = useRef<View | null>(null);

  /**
   * sets the screenreader focus to the header after mount
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      const node = findNodeHandle(headerRef.current);
      if (node) {
        AccessibilityInfo.setAccessibilityFocus(node);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, []);
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
        <CustomStyledHeader title="FAQ Kriz" headerRef={headerRef} />
      </View>
      <ThemedView style={{ flex: 1 }}>
        <FAQSection />
      </ThemedView>
    </SafeAreaView>
  );
}
