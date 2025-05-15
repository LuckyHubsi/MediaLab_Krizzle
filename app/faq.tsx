import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import FAQSection from "@/components/ui/FAQSection/FAQSection";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { Platform, SafeAreaView, StatusBar, View } from "react-native";

export default function FaqScreen() {
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
