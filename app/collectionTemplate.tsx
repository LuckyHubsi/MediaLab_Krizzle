import CreateCollectionTemplate from "@/components/ui/CreateCollectionSteps/CreateCollectionTemplate/CreateCollectionTemplate";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { SafeAreaView, View } from "react-native";

export default function CollectionTemplateScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <CreateCollectionTemplate title={"Hey"} />
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
