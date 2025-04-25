import CreateCollection from "@/components/ui/CreateCollectionSteps/CreateCollection/CreateCollection";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CollectionTemplateScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <CreateCollection />
      </ThemedView>
    </SafeAreaView>
  );
}
