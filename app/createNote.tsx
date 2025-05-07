import React, { useCallback, useEffect, useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import Widget from "@/components/ui/Widget/Widget";
import { Card } from "@/components/ui/Card/Card";
import { Header } from "@/components/ui/Header/Header";
import { Button } from "@/components/ui/Button/Button";
import { TitleCard } from "@/components/ui/TitleCard/TitleCard";
import { TagPicker } from "@/components/ui/TagPicker/TagPicker";
import { ChooseCard } from "@/components/ui/ChooseCard/ChooseCard";
import { ChoosePopup } from "@/components/ui/ChoosePopup/ChoosePopup";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { KeyboardAvoidingView, Platform } from "react-native";
import {
  colorLabelMap,
  colorKeyMap,
  iconLabelMap,
} from "@/constants/LabelMaps";
import { Icons } from "@/constants/Icons";
import { NoteDTO } from "@/dto/NoteDTO";
import { PageType } from "@/utils/enums/PageType";
import { insertNote } from "@/services/NoteService";
import { TagDTO } from "@/dto/TagDTO";
import { ThemedText } from "@/components/ThemedText";
import { red } from "react-native-reanimated/lib/typescript/Colors";
import { DividerWithLabel } from "@/components/ui/DividerWithLabel/DividerWithLabel";
import { getAllTags } from "@/services/TagService";
import { useFocusEffect } from "@react-navigation/native";
import { GradientBackground } from "@/components/ui/GradientBackground/GradientBackground";

export default function CreateNoteScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [title, setTitle] = useState("");
  const [selectedTag, setSelectedTag] = useState<TagDTO | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#4599E8");
  const [selectedIcon, setSelectedIcon] = useState<
    keyof typeof MaterialIcons.glyphMap | null
  >(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState<"color" | "icon">("color");
  const [tags, setTags] = useState<TagDTO[]>([]);

  const selectedColorLabel = colorLabelMap[selectedColor] || "Choose Color";
  const selectedIconLabel = selectedIcon
    ? iconLabelMap[selectedIcon]
    : "Choose Icon";

  const colorOptions = Object.entries(Colors.widget).map(([key, value]) => {
    const label = colorLabelMap[Array.isArray(value) ? value[0] : value] ?? key;

    return {
      id: key,
      color: value,
      value: key,
      label,
    };
  });

  const getWidgetColorKey = (
    value: string,
  ): keyof typeof Colors.widget | undefined => {
    return Object.keys(Colors.widget).find(
      (key) =>
        (typeof Colors.widget[key as keyof typeof Colors.widget] === "string" &&
          Colors.widget[key as keyof typeof Colors.widget] === value) ||
        (Array.isArray(Colors.widget[key as keyof typeof Colors.widget]) &&
          Array.isArray(Colors.widget[key as keyof typeof Colors.widget]) &&
          Colors.widget[key as keyof typeof Colors.widget].includes(value)),
    ) as keyof typeof Colors.widget | undefined;
  };

  const createNote = async () => {
    if (title.trim().length === 0) {
      setTitleError("Title is required.");
      return;
    }

    setTitleError(null);

    let tagDTO: TagDTO | null = null;

    if (selectedTag !== null) {
      const matchingTag = tags.find(
        (tag) => tag.tag_label === selectedTag?.tag_label,
      );
      if (matchingTag) {
        tagDTO = {
          tagID: matchingTag.tagID,
          tag_label: matchingTag.tag_label,
        };
      }
    }

    const noteDTO: NoteDTO = {
      page_type: PageType.Note,
      page_title: title,
      page_icon: selectedIcon ?? undefined,
      page_color: (selectedColor as keyof typeof Colors.widget) || "#4599E8",
      archived: false,
      pinned: false,
      note_content: null,
      tag: tagDTO,
    };

    const id = await insertNote(noteDTO);
    router.replace({
      pathname: "/notePage",
      params: { pageId: id, title: title },
    });
  };

  useFocusEffect(
    useCallback(() => {
      const fetchTags = async () => {
        try {
          const tagData = await getAllTags();
          if (tagData) setTags(tagData);
        } catch (error) {
          console.error("Failed to load tags:", error);
        }
      };

      fetchTags();
    }, []),
  );

  return (
    <GradientBackground
      backgroundCardTopOffset={Platform.select({ ios: 100, android: 80 })}
      topPadding={Platform.select({ ios: 0, android: 0 })}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
        <View style={{ flex: 1, alignItems: "center", gap: 20 }}>
          <Card>
            <View style={{ alignItems: "center", gap: 20 }}>
              <Header title="Create Note" onIconPress={() => alert("Popup!")} />
              <Widget
                title={title || "Title"}
                label={selectedTag?.tag_label ?? "No tag"}
                pageType={PageType.Note}
                iconLeft={
                  <MaterialIcons
                    name={selectedIcon || "help"}
                    size={20}
                    color="black"
                  />
                }
                iconRight={
                  <MaterialIcons name="description" size={20} color="black" />
                }
                color={
                  (getWidgetColorKey(
                    selectedColor,
                  ) as keyof typeof Colors.widget) || "#4599E8"
                }
              />
            </View>
          </Card>

          <View style={{ width: "100%", gap: 20 }}>
            <Card>
              <TitleCard
                placeholder="Add a title to your Note"
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (text.trim().length > 0) setTitleError(null); // clear error while typing
                }}
              />
              {titleError && (
                <ThemedText
                  style={{
                    marginTop: 5,
                  }}
                  fontSize="s"
                  colorVariant="red"
                >
                  {titleError}
                </ThemedText>
              )}
            </Card>
            <DividerWithLabel label="optional" iconName="arrow-back" />
            <Card>
              <TagPicker
                tags={tags}
                selectedTag={selectedTag}
                onSelectTag={(tag) => {
                  setSelectedTag((prevTag) => (prevTag === tag ? null : tag));
                }}
                onViewAllPress={() => router.push("/tagManagement")}
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
                  selectedColor={
                    useColorScheme() === "dark"
                      ? Colors.dark.cardBackground
                      : Colors.light.cardBackground
                  }
                  selectedIcon={selectedIcon ?? undefined}
                  onPress={() => {
                    setPopupType("icon");
                    setPopupVisible(true);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            marginTop: 20,
            width: "100%",
          }}
        >
          <Button onPress={createNote}>Create</Button>
        </View>
      </ScrollView>
      <ChoosePopup
        visible={popupVisible}
        type={popupType}
        items={
          popupType === "color"
            ? colorOptions.map((option, index) => ({
                id: `${option.color}-${index}`,
                value: option.color,
                label: option.label,
              }))
            : Icons.map((iconName, index) => ({
                id: `${iconName}-${index}`,
                value: iconName,
              }))
        }
        selectedItem={popupType === "color" ? selectedColor : selectedIcon}
        onSelect={(itemValue) => {
          if (popupType === "color") {
            setSelectedColor(itemValue);
          } else {
            setSelectedIcon(itemValue as keyof typeof MaterialIcons.glyphMap);
          }
        }}
        onClose={() => setPopupVisible(false)}
        onDone={() => setPopupVisible(false)}
      />
    </GradientBackground>
  );
}
