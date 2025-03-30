import React from "react";
import { View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateNoteScreen() {
  return (
    <SafeAreaView>
      <ThemedView>
        <ThemedText fontSize="xxl" fontWeight="bold">
          Archive
        </ThemedText>
        <ThemedText>Lorem ipsum</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}
