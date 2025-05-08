import React, { useCallback, useEffect, useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { View, ScrollView, Keyboard } from "react-native";
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
import { GeneralPageDTO } from "@/dto/GeneralPageDTO";
import {
  getGeneralPageByID,
  updateGeneralPageData,
} from "@/services/GeneralPageService";
import { set } from "date-fns";
import { GradientBackground } from "@/components/ui/GradientBackground/GradientBackground";
import { useActiveColorScheme } from "@/context/ThemeContext";

export default function EditWidgetScreen() {
  const navigation = useNavigation();
  const colorScheme = useActiveColorScheme();
  const { widgetID } = useLocalSearchParams<{ widgetID: string }>();
  const [pageData, setPageData] = useState<GeneralPageDTO | null>();
  const [title, setTitle] = useState("");
  const [selectedTag, setSelectedTag] = useState<TagDTO | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedIcon, setSelectedIcon] = useState<
    keyof typeof MaterialIcons.glyphMap | null
  >(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState<"color" | "icon">("color");
  const [tags, setTags] = useState<TagDTO[]>([]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
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

  const updateWidget = async () => {
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

    await updateGeneralPageData(
      Number(widgetID),
      title,
      selectedIcon || "",
      selectedColor,
      tagDTO?.tagID || null,
    );

    router.back();
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

      const fetchGeneralPage = async () => {
        try {
          const generalPageData = await getGeneralPageByID(Number(widgetID));
          if (generalPageData) {
            setPageData(generalPageData);
            setTitle(generalPageData.page_title || "");
            setSelectedColor(generalPageData.page_color || "");
            setSelectedIcon(
              (generalPageData.page_icon as
                | keyof typeof MaterialIcons.glyphMap
                | null) || null,
            );
            setSelectedTag(generalPageData.tag || null);
          }
        } catch (error) {
          console.error("Failed to load page data:", error);
        }
      };

      fetchTags();
      fetchGeneralPage();
    }, []),
  );

  useEffect(() => {
    if (Platform.OS === "android") {
      const showSub = Keyboard.addListener("keyboardDidShow", () =>
        setKeyboardVisible(true),
      );
      const hideSub = Keyboard.addListener("keyboardDidHide", () =>
        setKeyboardVisible(false),
      );
      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }
  }, []);

  return (
    <GradientBackground
      backgroundCardTopOffset={Platform.select({ ios: 100, android: 80 })}
      topPadding={Platform.select({ ios: 0, android: 0 })}
    >
      <View style={{ marginBottom: 8 }}>
        <Card>
          <View style={{ alignItems: "center", gap: 20 }}>
            <Header title="Edit Widget" onIconPress={() => alert("Popup!")} />
            <Widget
              title={title || "Title"}
              label={selectedTag?.tag_label ?? "No tag"}
              pageType={PageType.Note}
              iconLeft={
                <MaterialIcons
                  name={selectedIcon || "help"}
                  size={22}
                  color="black"
                />
              }
              color={
                (getWidgetColorKey(
                  selectedColor,
                ) as keyof typeof Colors.widget) || "#4599E8"
              }
            />
          </View>
        </Card>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
        <View style={{ flex: 1, alignItems: "center", gap: 20 }}>
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
                  selectedColor={Colors[colorScheme].cardBackground}
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
      </ScrollView>
      {(Platform.OS !== "android" || !keyboardVisible) && (
        <View style={{ marginBottom: 10 }}>
          <Button onPress={updateWidget}>Save</Button>
        </View>
      )}
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
function setKeyboardVisible(arg0: boolean): void {
  throw new Error("Function not implemented.");
}
