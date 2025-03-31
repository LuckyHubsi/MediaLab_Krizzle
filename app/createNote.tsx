import React, { useState } from "react";
import { useNavigation } from "expo-router";
import { Alert, SafeAreaView } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import HorizontalPicker from "@/components/ui/HorizontalPicker/HorizontalPicker";
import WidgetPreview from "@/components/ui/WidgetPreview/WidgetPreview";
import BottomButtons from "@/components/ui/BottomButtons/BottomButtons";

export default function CreateNoteScreen() {
  const navigation = useNavigation();

  const icons: {
    id: string;
    icon: "star" | "favorite" | "check-circle" | "home";
  }[] = [
    { id: "1", icon: "star" },
    { id: "2", icon: "favorite" },
    { id: "3", icon: "check-circle" },
    { id: "4", icon: "home" },
  ];

  const colors: {
    id: string;
    color: string;
  }[] = [
    { id: "1", color: "red" },
    { id: "2", color: "blue" },
    { id: "3", color: "green" },
    { id: "4", color: "yellow" },
  ];

  const [widgetDefaultIcon, setWidgetDefaultIcon] = useState(icons[0].icon);
  const [widgetBackgroundColor, setWidgetBackgroundColor] = useState("white");

  const handleIconSelect = (iconId: string) => {
    const selectedIcon = icons.find((icon) => icon.id === iconId);
    if (selectedIcon) {
      setWidgetDefaultIcon(selectedIcon.icon);
    }
  };

  const handleColorSelect = (colorId: string) => {
    const selectedColor = colors.find((color) => color.id === colorId);
    if (selectedColor) {
      setWidgetBackgroundColor(selectedColor.color);
    }
  };

  const handleDiscard = () => {
    Alert.alert("Discard", "Are you sure you want to discard?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Discard",
        style: "destructive",
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const handleNext = () => {
    console.log("Next clicked");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <ThemedView
        style={{
          flex: 1,
          padding: 20,
        }}
      >
        <WidgetPreview
          icon1={widgetDefaultIcon}
          icon2="favorite"
          tag="Tags"
          title="Title"
          backgroundColor={widgetBackgroundColor}
        />
        <HorizontalPicker
          title="Icon"
          items={icons}
          onSelect={handleIconSelect}
        />
        <HorizontalPicker
          title="Color"
          items={colors}
          onSelect={handleColorSelect}
        />
        <BottomButtons
          titleLeftButton="discard"
          titleRightButton="create"
          onDiscard={handleDiscard}
          onNext={handleNext}
        />
      </ThemedView>
    </SafeAreaView>
  );
}
