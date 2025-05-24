import React, { useCallback, useEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import { View, ScrollView, Keyboard } from "react-native";
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
import { NoteDTO } from "@/shared/dto/NoteDTO";
import { TagDTO } from "@/shared/dto/TagDTO";
import { ThemedText } from "@/components/ThemedText";
import { DividerWithLabel } from "@/components/ui/DividerWithLabel/DividerWithLabel";
import { useFocusEffect } from "@react-navigation/native";
import { GradientBackground } from "@/components/ui/GradientBackground/GradientBackground";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { ButtonContainer } from "@/components/ui/CreateCollectionSteps/CreateCollection/CreateCollection.styles";
import BottomButtons from "@/components/ui/BottomButtons/BottomButtons";
import { PageType } from "@/shared/enum/PageType";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";
import { useServices } from "@/context/ServiceContext";
import { ServiceErrorType } from "@/shared/error/ServiceError";

export default function CreateNoteScreen() {
  const { noteService, tagService } = useServices();

  const navigation = useNavigation();
  const colorScheme = useActiveColorScheme();
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

  const { showSnackbar } = useSnackbar();

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
      showSnackbar("Please enter a title to continue.", "bottom", "error");
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
      pin_count: 0,
      parentID: null, // TODO - pass the correct folderID if screen accessed from a folder page
    };

    const id = await noteService.insertNote(noteDTO);
    router.replace({
      pathname: "/notePage",
      params: { pageId: id, title: title },
    });

    showSnackbar(
      `Successfully created Note: "${title}". `,
      "bottom",
      "success",
    );
  };

  useFocusEffect(
    useCallback(() => {
      const fetchTags = async () => {
        try {
          const result = await tagService.getAllTags();
          if (result.success) {
            if (result.value) setTags(result.value);
          } else {
            // TODO: show the error modal
          }
        } catch (error) {
          console.error("Failed to load tags:", error);
        }
      };

      fetchTags();
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
      backgroundCardTopOffset={Platform.select({ ios: 100, android: 95 })}
      topPadding={Platform.select({ ios: 0, android: 15 })}
    >
      <View style={{ marginBottom: 8 }}>
        <Card>
          <View style={{ alignItems: "center", gap: 20 }}>
            <View style={{ alignItems: "center" }}>
              <ThemedText fontSize="l" fontWeight="bold">
                Create Note
              </ThemedText>
              <ThemedText
                fontSize="s"
                fontWeight="light"
                colorVariant={colorScheme === "light" ? "grey" : "lightGrey"}
              >
                Design your new note’s widget
              </ThemedText>
            </View>
            <Widget
              title={title || "Title"}
              label={selectedTag?.tag_label ?? ""}
              pageType={PageType.Note}
              icon={
                selectedIcon ? (
                  <MaterialIcons name={selectedIcon} size={22} color="black" />
                ) : undefined
              }
              color={
                (getWidgetColorKey(
                  selectedColor,
                ) as keyof typeof Colors.widget) || "#4599E8"
              }
              isPreview={true}
            />
          </View>
        </Card>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 70 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, alignItems: "center", gap: 20 }}>
          <View style={{ width: "100%", gap: 20 }}>
            <Card>
              <TitleCard
                placeholder="Add a title"
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
                onViewAllPress={() => router.navigate("/tagManagement")}
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
        <View
          style={{
            paddingBottom: Platform.OS === "android" ? 8 : 24,
          }}
        >
          <BottomButtons
            titleLeftButton="Discard"
            titleRightButton="Save"
            onDiscard={() => {
              router.back();
            }}
            onNext={createNote}
            variant="back"
            hasProgressIndicator={false}
            progressStep={2}
          />
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
            setSelectedIcon((prevIcon) =>
              prevIcon === itemValue
                ? null
                : (itemValue as keyof typeof MaterialIcons.glyphMap),
            );
          }
        }}
        onClose={() => setPopupVisible(false)}
        onDone={() => setPopupVisible(false)}
      />
    </GradientBackground>
  );
}
