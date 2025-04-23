import React, { useState } from "react";
import { SafeAreaView, View, FlatList } from "react-native";
import { Card } from "@/components/ui/Card/Card";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { Button } from "@/components/ui/Button/Button";
import { Header } from "@/components/ui/Header/Header";
import { AddButton } from "@/components/ui/AddButton/AddButton";

export default function AddListsScreen() {
  const [cards, setCards] = useState([{ id: Date.now().toString() }]);

  const handleAddCard = () => {
    const newCard = { id: Date.now().toString() };
    setCards((prevCards) => [...prevCards, newCard]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Card>
            <Header title="Adding Lists" />
          </Card>

          <View
            style={{ width: "100%", marginVertical: 16, alignItems: "center" }}
          >
            <AddButton onPress={handleAddCard} />
          </View>

          <FlatList
            data={cards}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingBottom: 100,
              paddingHorizontal: 20,
              gap: 20,
            }}
            renderItem={() => <Card />}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 20,
            right: 20,
          }}
        >
          <Button>Next</Button>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
