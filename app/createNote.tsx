import React, { useState } from "react";
import { useNavigation } from "expo-router";
import { SafeAreaView, View, ScrollView } from "react-native";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import WidgetPreview from "@/components/ui/WidgetPreview/WidgetPreview";
import BottomButtons from "@/components/ui/BottomButtons/BottomButtons";
import { Card } from "@/components/ui/Card/Card";
import { Header } from "@/components/ui/Header/Header";
import { Button } from "@/components/ui/Button/Button";
import { TitleCard } from "@/components/ui/TitleCard/TitleCard";
import { TagPicker } from "@/components/ui/TagPicker/TagPicker";
import { Widget } from "@/components/ui/Widget/Widget";
import { ChooseCard } from "@/components/ui/ChooseCard/ChooseCard";
import { ChoosePopup } from "@/components/ui/ChoosePopup/ChoosePopup";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { colorLabelMap, iconLabelMap } from "@/constants/LabelMaps";
import { Icons } from "@/constants/Icons";

export default function CreateNoteScreen() {
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate("notePage");
  };

  const [title, setTitle] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#4599E8");
  const [selectedIcon, setSelectedIcon] =
    useState<keyof typeof MaterialIcons.glyphMap>("home");

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState<"color" | "icon">("color");

  const tags = ["Work", "Personal", "Urgent", "Ideas"];

  const selectedColorLabel = colorLabelMap[selectedColor] || "Choose Color";
  const selectedIconLabel = iconLabelMap[selectedIcon] || "Choose Icon";

  const colorOptions = Object.entries(Colors.widget)
    .filter(
      ([key, val]) =>
        typeof val === "string" && !key.toLowerCase().includes("gradient"),
    )
    .map(([_, value]) => ({
      color: value,
      label: colorLabelMap[value] || "Unnamed",
    }));

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Card>
            <Header title="Create Note" onIconPress={() => alert("Popup!")} />
            <Widget
              backgroundColor={selectedColor}
              showPreviewLabel={true}
              selectedIcon={selectedIcon}
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
                  onSelectTag={(tag) => {
                    setSelectedTag((prevTag) => (prevTag === tag ? null : tag));
                  }}
                  onViewAllPress={() => navigation.navigate("tagManagement")}
                />
              </Card>

              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  justifyContent: "space-between",
                  gap: 15,
                }}
              >
                <View style={{ flex: 1 }}>
                  <ChooseCard
                    label={selectedColorLabel}
                    selectedColor={selectedColor}
                    onPress={() => {
                      setPopupType("color");
                      setPopupVisible(true);
                    }}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <ChooseCard
                    label={selectedIconLabel}
                    selectedColor={selectedColor}
                    selectedIcon={selectedIcon}
                    onPress={() => {
                      setPopupType("icon");
                      setPopupVisible(true);
                    }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        <ChoosePopup
          visible={popupVisible}
          type={popupType}
          items={
            popupType === "color"
              ? colorOptions.map((option) => option.color)
              : Icons
          }
          selectedItem={popupType === "color" ? selectedColor : selectedIcon}
          onSelect={(item) => {
            if (popupType === "color") {
              setSelectedColor(item);
            } else {
              setSelectedIcon(item as keyof typeof MaterialIcons.glyphMap);
            }
          }}
          onClose={() => setPopupVisible(false)}
          onDone={() => setPopupVisible(false)}
        />

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
