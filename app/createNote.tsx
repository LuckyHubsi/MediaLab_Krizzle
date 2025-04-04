import React, { useState } from "react";
import { useNavigation } from "expo-router";
import { Alert, SafeAreaView, View } from "react-native";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import WidgetPreview from "@/components/ui/WidgetPreview/WidgetPreview";
import BottomButtons from "@/components/ui/BottomButtons/BottomButtons";
import { Card } from "@/components/ui/Card/Card";
import { Header } from "@/components/ui/Header/Header";
import { Button } from "@/components/ui/Button/Button";
import { ThemedText } from "@/components/ThemedText";
import { ChooseCard } from "@/components/ui/ChooseCard/ChooseCard";
import { TitleCard } from "@/components/ui/TitleCard/TitleCard";
import { TagPicker } from "@/components/ui/TagPicker/TagPicker";
import { Widget } from "@/components/ui/Widget/Widget";
import { ScrollView } from "react-native";

export default function CreateNoteScreen() {
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate("notePage");
  };

  const [title, setTitle] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tags = ["Work", "Personal", "Urgent", "Ideas"];

  return (
    <SafeAreaView style={{ flex: 1 /*backgroundColor: "yellow"*/ }}>
      <ThemedView style={{ flex: 1 /*backgroundColor: "red"*/ }}>
        <View
          style={{
            flex: 1,
            alignItems: "center" /*backgroundColor: "blue"*/,
          }}
        >
          <Card>
            <Header title="Create Note" onIconPress={() => alert("Popup!")} />
            <Widget
              backgroundColor="#3D3D3D"
              showPreviewLabel={true}
              selectedIcon="star"
              typeIcon="note"
              title={title || "Title"}
              tag={selectedTag ?? undefined}
            />
          </Card>
          <ScrollView contentContainerStyle={{ paddingBottom: 75 }}>
            <View style={{ width: "100%", marginTop: 16, gap: 25 }}>
              <Card>
                <TitleCard
                  placeholder="Add a title to your Note"
                  value={title}
                  onChangeText={setTitle}
                />
              </Card>
              <Card>
                <TagPicker
                  tags={tags}
                  selectedTag={selectedTag}
                  onSelectTag={setSelectedTag}
                  onViewAllPress={() => navigation.navigate("tagManagement")}
                />
              </Card>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <ChooseCard
                  label="Choose Color"
                  selectedColor=""
                  onPress={() => alert("Open popup for selection!")}
                />
                <ChooseCard
                  label="Choose Icon"
                  selectedColor=""
                  selectedIcon="star"
                  onPress={() => alert("Open popup for selection!")}
                />
              </View>
            </View>
          </ScrollView>
        </View>

        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 20,
            right: 20,
            width: "100%",
          }}
        >
          <Button onPress={handleNext}>Create</Button>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
