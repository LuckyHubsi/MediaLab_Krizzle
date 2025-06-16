import React, { useCallback, useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { View, ScrollView, Keyboard } from "react-native";
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
import { TagDTO } from "@/shared/dto/TagDTO";
import { ThemedText } from "@/components/ThemedText";
import { DividerWithLabel } from "@/components/ui/DividerWithLabel/DividerWithLabel";
import { useFocusEffect } from "@react-navigation/native";
import { GeneralPageDTO } from "@/shared/dto/GeneralPageDTO";
import { GradientBackground } from "@/components/ui/GradientBackground/GradientBackground";
import { useActiveColorScheme } from "@/context/ThemeContext";
import BottomButtons from "@/components/ui/BottomButtons/BottomButtons";
import { PageType } from "@/shared/enum/PageType";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";
import { useServices } from "@/context/ServiceContext";
import { EnrichedError } from "@/shared/error/ServiceError";
import { ErrorPopup } from "@/components/Modals/ErrorModal/ErrorModal";

/**
 * Screen for editing a widget.
 */
export default function EditWidgetScreen() {
  const { generalPageService, tagService } = useServices();
  const { lastCreatedTag: lastCreatedTagParam } = useLocalSearchParams();
  const colorScheme = useActiveColorScheme();
  const { widgetID } = useLocalSearchParams<{ widgetID: string }>();
  const [pageData, setPageData] = useState<GeneralPageDTO | null>();
  const [title, setTitle] = useState("");
  const [selectedTag, setSelectedTag] = useState<TagDTO | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedIcon, setSelectedIcon] = useState<
    keyof typeof MaterialIcons.glyphMap | null
  >(null);
  const pageType = pageData?.page_type ?? PageType.Note;
  const [titleError, setTitleError] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState<"color" | "icon">("color");
  const [tags, setTags] = useState<TagDTO[]>([]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const selectedColorLabel = colorLabelMap[selectedColor] || "Choose Color";
  const { showSnackbar } = useSnackbar();
  const [errors, setErrors] = useState<EnrichedError[]>([]);
  const [showError, setShowError] = useState(false);
  const selectedIconLabel = selectedIcon
    ? iconLabelMap[selectedIcon]
    : "Choose Icon";
  const colorOptions = Object.entries(Colors.widget).map(([key, value]) => {
    const label = colorLabelMap[Array.isArray(value) ? value[0] : value] ?? key;

    /**
     * Maps widget colors to a standardized format for the color picker.
     */
    return {
      id: key,
      color: value,
      value: key,
      label,
    };
  });

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

  /**
   * Reference to store initial values for comparison after updates.
   */
  const initialValuesRef = useRef({
    title: "",
    selectedTag: null as TagDTO | null,
    selectedColor: "",
    selectedIcon: null as keyof typeof MaterialIcons.glyphMap | null,
  });

  /**
   * Updates the widget with the current state values.
   */
  const updateWidget = async () => {
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

    const newPageDTO: GeneralPageDTO = {
      pageID: Number(widgetID),
      page_title: title,
      page_icon: selectedIcon,
      page_color: selectedColor,
      tag: tagDTO,
      page_type: pageData?.page_type ?? PageType.Note,
      archived: pageData?.archived ?? false,
      pinned: pageData?.pinned ?? false,
      parentID: pageData?.parentID ?? null,
    };
    const updateResult =
      await generalPageService.updateGeneralPageData(newPageDTO);

    if (updateResult.success) {
      const hasChanges =
        title !== initialValuesRef.current.title ||
        selectedColor !== initialValuesRef.current.selectedColor ||
        selectedIcon !== initialValuesRef.current.selectedIcon ||
        (selectedTag?.tagID || null) !==
          (initialValuesRef.current.selectedTag?.tagID || null);

      if (hasChanges) {
        showSnackbar("Successfully updated Widget!", "bottom", "success");
      }

      // remove all prior errors from the widget update source if service call succeeded
      setErrors((prev) =>
        prev.filter((error) => error.source !== "widget:update"),
      );
      router.back();
      router.setParams({ title: newPageDTO.page_title });
    } else {
      // set all errors to the previous errors plus add the new error
      // define the id and the source and set its read status to false
      setErrors((prev) => [
        ...prev,
        {
          ...updateResult.error,
          hasBeenRead: false,
          id: `${Date.now()}-${Math.random()}`,
          source: "widget:update",
        },
      ]);
      setShowError(true);
    }
  };

  /**
   * Focus effect to fetch tags and widget data when the screen is focused.
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

      /**
       * Fetches the general page data for the widget based on the widgetID.
       */
      const fetchGeneralPage = async () => {
        try {
          const widgetResult = await generalPageService.getGeneralPageByID(
            Number(widgetID),
          );
          if (widgetResult.success) {
            setPageData(widgetResult.value);
            setTitle(widgetResult.value.page_title || "");
            setSelectedColor(widgetResult.value.page_color || "");
            setSelectedIcon(
              (widgetResult.value.page_icon as
                | keyof typeof MaterialIcons.glyphMap
                | null) || null,
            );
            //save current data to compare if new data has been entered
            initialValuesRef.current = {
              title: widgetResult.value.page_title || "",
              selectedColor: widgetResult.value.page_color || "",
              selectedIcon:
                (widgetResult.value
                  .page_icon as keyof typeof MaterialIcons.glyphMap) || null,
              selectedTag: widgetResult.value.tag || null,
            };

            setSelectedTag(widgetResult.value.tag || null);

            // remove all prior errors from the widget retrieval source if service call succeeded
            setErrors((prev) =>
              prev.filter((error) => error.source !== "widget:retrieval"),
            );
          } else {
            // set all errors to the previous errors plus add the new error
            // define the id and the source and set its read status to false
            setErrors((prev) => [
              ...prev,
              {
                ...widgetResult.error,
                hasBeenRead: false,
                id: `${Date.now()}-${Math.random()}`,
                source: "widget:retrieval",
              },
            ]);
            setShowError(true);
          }
        } catch (error) {
          console.error("Failed to load page data:", error);
        }
      };

      fetchTags();
      fetchGeneralPage();
    }, []),
  );

  /**
   * Effect to handle keyboard visibility on Android.
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
   * - Card: A styled card component for displaying content.
   * - ThemedText: A text component that adapts to the current theme.
   * - Widget: Displays a preview of the widget with the current settings.
   * - TitleCard: A card for editing the widget title.
   * - DividerWithLabel: A divider with a label for better UI organization.
   * - TagPicker: Allows selection of tags for the widget.
   * - ChooseCard: A card for selecting colors or icons.
   * - BottomButtons: Provides buttons for discarding changes or saving the widget.
   * - ChoosePopup: A popup for selecting colors or icons.
   */
  return (
    <GradientBackground
      backgroundCardTopOffset={Platform.select({ ios: 100, android: 95 })}
      topPadding={Platform.select({ ios: 0, android: 15 })}
    >
      <View style={{ marginBottom: 8 }}>
        <Card maxHeight={320} scrollable={true}>
          <View style={{ alignItems: "center", gap: 20 }}>
            <View style={{ alignItems: "center" }}>
              <ThemedText fontSize="l" fontWeight="bold">
                Edit Widget
              </ThemedText>
              <ThemedText
                fontSize="s"
                fontWeight="light"
                colorVariant={colorScheme === "light" ? "grey" : "lightGrey"}
              >
                Change the appearance of your widget
              </ThemedText>
            </View>
            <Widget
              title={title || "Title"}
              label={selectedTag?.tag_label?.trim() || ""}
              pageType={pageType}
              icon={
                selectedIcon ? (
                  <MaterialIcons name={selectedIcon} size={22} color="black" />
                ) : undefined
              }
              color={
                (getWidgetColorKey(
                  selectedColor,
                ) as keyof typeof Colors.widget) || Colors.primary
              }
              isPreview={true}
            />
          </View>
        </Card>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 75 }}
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
            onNext={updateWidget}
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
            setSelectedIcon((prev) =>
              prev === itemValue
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
