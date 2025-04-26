import CreateCollectionTemplate from "@/components/ui/CreateCollectionSteps/CreateCollectionTemplate/CreateCollectionTemplate";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CollectionTemplateScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}></View>
      </ThemedView>
    </SafeAreaView>
  );
}
