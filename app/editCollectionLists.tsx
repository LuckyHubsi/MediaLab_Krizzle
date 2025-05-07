import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/ui/Header/Header";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { View } from "react-native";
import CreateCollectionList from "@/components/ui/CreateCollectionSteps/CreateCollectionList/CreateCollectionList";
import EditCollectionLists from "@/components/ui/EditCollectionLists/EditCollectionLists";
import { ro } from "date-fns/locale";
import { router } from "expo-router";
import { CollectionData } from "@/components/ui/CreateCollectionSteps/CreateCollection/CreateCollection";

export default function EditCollectionListsScreen() {
  const mockCollectionData: CollectionData = {
    title: "My Book Collection",
    selectedTag: {
      tagID: 1,
      tag_label: "Books",
    },
    selectedColor: "#FFB74D",
    selectedIcon: "book",
    lists: [
      { id: "list-1", title: "To Read" },
      { id: "list-2", title: "Currently Reading" },
      { id: "list-3", title: "Finished" },
      { id: "list-4", title: "sdfsdfsdf" },
      { id: "list-4", title: "Finisdfsshed" },
    ],
    templates: [
      {
        id: 101,
        itemType: "Text",
        isPreview: true,
        title: "Notes",
      },
      {
        id: 102,
        itemType: "Select",
        isPreview: false,
        title: "Genre",
        options: ["Fiction", "Non-Fiction", "Sci-Fi", "Romance"],
      },
      {
        id: 103,
        itemType: "Rating",
        isPreview: true,
        rating: "star",
      },
    ],
  };
  const [data, setData] = useState<CollectionData>(mockCollectionData);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <EditCollectionLists
          data={mockCollectionData}
          setData={() => {}}
          onBack={() => {
            router.back();
          }}
        />
      </ThemedView>
    </SafeAreaView>
  );
}
