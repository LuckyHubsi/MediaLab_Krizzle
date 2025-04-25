import React, { useState } from "react";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { useRouter } from "expo-router";
import CreateCollectionList from "@/components/ui/CreateCollectionSteps/CreateCollectionList/CreateCollectionList";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddListsScreen() {
  const [cards, setCards] = useState([{ id: Date.now().toString() }]);
  const route = useRouter();

  const handleAddCard = () => {
    const newCard = { id: Date.now().toString() };
    setCards((prevCards) => [...prevCards, newCard]);
  };

  // const handleNext = () => {
  //   route.push("./collectionPage");
  // };

  const handleNext = () => {
    route.push("./collectionTemplate");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <CreateCollectionList />
      </ThemedView>
    </SafeAreaView>
  );
}
