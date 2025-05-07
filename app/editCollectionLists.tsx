import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/ui/Header/Header";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";

export default function EditCollectionListsScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* //Header with back button and title */}
      <CustomStyledHeader
        title="Edit Collection" //Here should be the title of the collection
        backBehavior="goHome" // Go back to home when back button is pressed
        onIconMenuPress={() => alert("Menu icon pressed!")} // action when icon menu is pressed
      />
    </SafeAreaView>
  );
}
