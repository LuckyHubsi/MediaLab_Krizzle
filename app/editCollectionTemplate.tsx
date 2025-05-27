import { ThemedText } from "@/components/ThemedText";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { useServices } from "@/context/ServiceContext";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React from "react";
import { Platform, SafeAreaView, StatusBar, View } from "react-native";

export default function editCollectionTemplate() {
  const { collectionService } = useServices();
  const { collectionId, templateId } = useLocalSearchParams<{
    collectionId: string;
    templateId: string;
  }>();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <CustomStyledHeader title="Edit Template" />
      </View>
      <ThemedView style={{ flex: 1 }}>
        <ThemedText>
          This feature is not yet implemented. Please check back later.
        </ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}
