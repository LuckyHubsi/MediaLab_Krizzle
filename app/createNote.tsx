import React, { useCallback, useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { View, ScrollView, Keyboard, useWindowDimensions } from "react-native";
import Widget from "@/components/ui/Widget/Widget";
import { Card } from "@/components/ui/Card/Card";
import { TitleCard } from "@/components/ui/TitleCard/TitleCard";
import { TagPicker } from "@/components/ui/TagPicker/TagPicker";
import { ChooseCard } from "@/components/ui/ChooseCard/ChooseCard";
import { ChoosePopup } from "@/components/ui/ChoosePopup/ChoosePopup";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Platform } from "react-native";
import { colorLabelMap, iconLabelMap } from "@/constants/LabelMaps";
import { Icons } from "@/constants/Icons";
import { NoteDTO } from "@/shared/dto/NoteDTO";
import { TagDTO } from "@/shared/dto/TagDTO";
import { ThemedText } from "@/components/ThemedText";
import { DividerWithLabel } from "@/components/ui/DividerWithLabel/DividerWithLabel";
import { useFocusEffect } from "@react-navigation/native";
import { GradientBackground } from "@/components/ui/GradientBackground/GradientBackground";
import { useActiveColorScheme } from "@/context/ThemeContext";
import BottomButtons from "@/components/ui/BottomButtons/BottomButtons";
import { PageType } from "@/shared/enum/PageType";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";
import { useServices } from "@/context/ServiceContext";
import { EnrichedError } from "@/shared/error/ServiceError";
import { ErrorPopup } from "@/components/Modals/ErrorModal/ErrorModal";

/**
 * CreateNoteScreen is a screen that allows users to create a new note.
 */

export default function CreateNoteScreen() {
  const { noteService, tagService } = useServices();
  const { lastCreatedTag: lastCreatedTagParam } = useLocalSearchParams();

  const colorScheme = useActiveColorScheme();
  const [title, setTitle] = useState("");
  const [selectedTag, setSelectedTag] = useState<TagDTO | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(Colors.primary);
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

  const [errors, setErrors] = useState<EnrichedError[]>([]);
  const [showError, setShowError] = useState(false);
  const [cardHeight, setCardHeight] = useState(0);

  // Calculate screen dimensions and orientation
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const screenSize = isLandscape ? width : height;
  const isHighCard = cardHeight > height * 0.4;
  const isSmallScreen = screenSize < (isLandscape ? 1500 : 600);

  // Create a list of color options for the ChoosePopup
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

  /**
   * Finds the key of a widget color based on its value.
   */
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

  // Function to create a new note
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
      page_color:
        (selectedColor as keyof typeof Colors.widget) || Colors.primary,
      archived: false,
      pinned: false,
      note_content: null,
      tag: tagDTO,
      pin_count: 0,
      parentID: null, // TODO - pass the correct folderID if screen accessed from a folder page
    };

    const noteIDResult = await noteService.insertNote(noteDTO);
    if (noteIDResult.success) {
      // remove all prior errors from the note insert source if service call succeeded
      setErrors((prev) =>
        prev.filter((error) => error.source !== "note:insert"),
      );

      router.replace({
        pathname: "/notePage",
        params: { pageId: noteIDResult.value, title: title },
      });

      showSnackbar(
        `Successfully created Note: "${title}". `,
        "bottom",
        "success",
      );
    } else {
      // set all errors to the previous errors plus add the new error
      // define the id and the source and set its read status to false
      setErrors((prev) => [
        ...prev,
        {
          ...noteIDResult.error,
          hasBeenRead: false,
          id: `${Date.now()}-${Math.random()}`,
          source: "note:insert",
        },
      ]);
      setShowError(true);
    }
  };

  /**
   * useFocusEffect hook to fetch tags when the screen is focused.
   */
  useFocusEffect(
    useCallback(() => {
      const fetchTags = async () => {
        try {
          const tagResult = await tagService.getAllTags();
          if (tagResult.success) {
            if (tagResult.value) setTags(tagResult.value);

            // remove all prior errors from the tag retrieval source if service call succeeded
            setErrors((prev) =>
              prev.filter((error) => error.source !== "tags:retrieval"),
            );
          } else {
            // set all errors to the previous errors plus add the new error
            // define the id and the source and set its read status to false
            setErrors((prev) => [
              ...prev,
              {
                ...tagResult.error,
                hasBeenRead: false,
                id: `${Date.now()}-${Math.random()}`,
                source: "tags:retrieval",
              },
            ]);
            setShowError(true);
          }
        } catch (error) {
          console.error("Failed to load tags:", error);
        }
      };

      fetchTags();
    }, []),
  );

  /**
   * Effect to handle keyboard visibility on Android.
   * This is necessary to adjust the layout when the keyboard is shown or hidden.
   */
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

  /**
   * Effect to handle the last created tag parameter.
   */
  useEffect(() => {
    if (lastCreatedTagParam && typeof lastCreatedTagParam === "string") {
      try {
        const tag = JSON.parse(lastCreatedTagParam);
        if (tag && tag.tagID) {
          setSelectedTag(tag as TagDTO);
        }
      } catch (err) {
        console.warn("Invalid tag param:", err);
      }
    }
  }, [lastCreatedTagParam]);

  /**
   * Components used:
   *
   * - GradientBackground: Provides a gradient background for the screen.
   * - Card: A reusable card component for displaying content.
   * - ThemedText: A themed text component.
   * - Widget: Displays a preview of the note widget with title, tag, icon, and color.
   * - TitleCard: A card for entering the note title.
   * - TagPicker: Allows users to select a tag for the note.
   * - ChooseCard: A card for selecting color and icon.
   */
  return (
    <GradientBackground
      backgroundCardTopOffset={Platform.select({ ios: 100, android: 95 })}
      topPadding={Platform.select({ ios: 0, android: 15 })}
    >
      {isSmallScreen || isHighCard ? (
        <>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 70 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ marginBottom: 20 }}>
              <Card>
                <View style={{ alignItems: "center", gap: 20 }}>
                  <View style={{ alignItems: "center" }}>
                    <ThemedText fontSize="l" fontWeight="bold">
                      Create Note
                    </ThemedText>
                    <ThemedText
                      fontSize="s"
                      fontWeight="light"
                      colorVariant={
                        colorScheme === "light" ? "grey" : "lightGrey"
                      }
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
                        <MaterialIcons
                          name={selectedIcon}
                          size={22}
                          color="black"
                        />
                      ) : undefined
                    }
                    color={getWidgetColorKey(selectedColor) ?? "blue"}
                    isPreview={true}
                  />
                </View>
              </Card>
            </View>
            <View style={{ flex: 1, alignItems: "center", gap: 20 }}>
              <View style={{ width: "100%", gap: 20 }}>
                <Card>
                  <TitleCard
                    placeholder="Add a title"
                    value={title}
                    onChangeText={(text) => {
                      setTitle(text);
                      if (text.trim().length > 0) setTitleError(null);
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
                      setSelectedTag((prevTag) =>
                        prevTag === tag ? null : tag,
                      );
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
                      type="color"
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
                      type="icon"
                    />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </>
      ) : (
        <>
          <View
            style={{ marginBottom: 8 }}
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              setCardHeight(height);
            }}
          >
            <Card>
              <View style={{ alignItems: "center", gap: 20 }}>
                <View style={{ alignItems: "center" }}>
                  <ThemedText fontSize="l" fontWeight="bold">
                    Create Note
                  </ThemedText>
                  <ThemedText
                    fontSize="s"
                    fontWeight="light"
                    colorVariant={
                      colorScheme === "light" ? "grey" : "lightGrey"
                    }
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
                      <MaterialIcons
                        name={selectedIcon}
                        size={22}
                        color="black"
                      />
                    ) : undefined
                  }
                  color={getWidgetColorKey(selectedColor) ?? "blue"}
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
                      if (text.trim().length > 0) setTitleError(null);
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
                      setSelectedTag((prevTag) =>
                        prevTag === tag ? null : tag,
                      );
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
                      type="color"
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
                      type="icon"
                    />
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </>
      )}
      {(Platform.OS !== "android" || !keyboardVisible) && (
        <View
          style={{
            paddingBottom: Platform.OS === "android" ? 8 : 24,
          }}
        >
          <BottomButtons
            titleLeftButton="Discard"
            titleRightButton="Create"
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

      <ErrorPopup
        visible={showError && errors.some((e) => !e.hasBeenRead)}
        errors={errors.filter((e) => !e.hasBeenRead) || []}
        onClose={(updatedErrors) => {
          // all current errors get tagged as hasBeenRead true on close of the modal (dimiss or click outside)
          const updatedIds = updatedErrors.map((e) => e.id);
          const newCombined = errors.map((e) =>
            updatedIds.includes(e.id) ? { ...e, hasBeenRead: true } : e,
          );
          setErrors(newCombined);
          setShowError(false);
        }}
      />
    </GradientBackground>
  );
}
