import React, { FC, useCallback, useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Keyboard, Platform, useWindowDimensions, View } from "react-native";
import { Card } from "@/components/ui/Card/Card";
import Widget from "@/components/ui/Widget/Widget";
import { TitleCard } from "@/components/ui/TitleCard/TitleCard";
import { TagPicker } from "@/components/ui/TagPicker/TagPicker";
import { ChooseCard } from "@/components/ui/ChooseCard/ChooseCard";
import { ChoosePopup } from "@/components/ui/ChoosePopup/ChoosePopup";
import { DividerWithLabel } from "@/components/ui/DividerWithLabel/DividerWithLabel";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { colorLabelMap, iconLabelMap } from "@/constants/LabelMaps";
import { Icons } from "@/constants/Icons";
import { ThemedText } from "@/components/ThemedText";
import {
  ScrollContainer,
  ContentWrapper,
  TwoColumnRow,
} from "./CreateCollection.styles";
import { InfoPopup } from "@/components/Modals/InfoModal/InfoModal";
import { IconTopRight } from "../../IconTopRight/IconTopRight";
import BottomButtons from "../../BottomButtons/BottomButtons";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { TagDTO } from "@/shared/dto/TagDTO";
import { useFocusEffect } from "@react-navigation/native";
import { useSnackbar } from "../../Snackbar/Snackbar";
import { PageType } from "@/shared/enum/PageType";
import { useServices } from "@/context/ServiceContext";
import { EnrichedError } from "@/shared/error/ServiceError";
import { ErrorPopup } from "@/components/Modals/ErrorModal/ErrorModal";

/**
 * Component for creating a collection widget with customizable options.
 * Allows users to set a title, select a tag, choose a color and icon for the note/collection widget.
 * @param title (required) - The title of the collection.
 * @param selectedTag - The tag selected for the collection.
 * @param selectedColor - The color selected for the collection widget.
 * @param selectedIcon - The icon selected for the collection widget.
 * @param lists - The lists associated with the collection.
 * @param templates - The templates associated with the collection.
 * @param data (required) - The data object containing all the collection properties.
 * @param setData (required) - Function to update the collection data.
 * @param onNext - Callback function to handle the next step in the creation process.
 * @param onBack - Callback function to handle going back.
 */

interface CreateCollectionProps {
  data: {
    title: string;
    selectedTag: TagDTO | null;
    selectedColor: string;
    selectedIcon?: keyof typeof MaterialIcons.glyphMap;
    lists: { id: string; title: string }[];
    templates: { id: number; itemType: string; isPreview: boolean }[];
  };
  setData: React.Dispatch<React.SetStateAction<any>>;
  onNext?: () => void;
  onBack?: () => void;
}
export type CollectionData = {
  title: string;
  selectedTag: TagDTO | null;
  selectedColor: string;
  selectedIcon?: keyof typeof MaterialIcons.glyphMap;
  lists: { id: string; title: string }[];
  templates: {
    id: number;
    itemType: string;
    isPreview: boolean;
    title?: string;
    options?: string[];
    rating?: keyof typeof MaterialIcons.glyphMap;
  }[];
};
const CreateCollection: FC<CreateCollectionProps> = ({
  data,
  setData,
  onBack,
  onNext,
}) => {
  // Services and hooks
  const { tagService } = useServices();
  const { lastCreatedTag: lastCreatedTagParam } = useLocalSearchParams();

  const colorScheme = useActiveColorScheme();

  // Destructure data properties for easier access
  const title = data.title;
  const selectedTag = data.selectedTag;
  const selectedColor = data.selectedColor;
  const selectedIcon = data.selectedIcon;

  // State management for the component
  const [hasClickedNext, setHasClickedNext] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState<"color" | "icon">("color");
  const [showHelp, setShowHelp] = useState(false);
  const [tags, setTags] = useState<TagDTO[]>([]);
  const selectedColorLabel = colorLabelMap[selectedColor] || "Choose Color";
  const selectedIconLabel = selectedIcon
    ? iconLabelMap[selectedIcon]
    : "Choose Icon";
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [errors, setErrors] = useState<EnrichedError[]>([]);
  const [showError, setShowError] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [cardHeight, setCardHeight] = useState(0);

  // Calculate screen dimensions and orientation
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const screenSize = isLandscape ? width : height;
  const isHighCard = cardHeight > height * 0.4;
  const isSmallScreen = screenSize < (isLandscape ? 1500 : 600);

  // Generate color options for the ChoosePopup
  const colorOptions = Object.entries(Colors.widget).map(([key, value]) => ({
    id: key,
    color: value,
    value: key,
    label: colorLabelMap[Array.isArray(value) ? value[0] : value] ?? key,
  }));

  /**
   * Function to get the key of the widget color based on the value.
   * This is used to map the selected color value to its corresponding key in the Colors.widget
   * @param value - The color value to find the key for.
   */
  const getWidgetColorKey = (
    value: string,
  ): keyof typeof Colors.widget | undefined =>
    Object.keys(Colors.widget).find(
      (key) =>
        (typeof Colors.widget[key as keyof typeof Colors.widget] === "string" &&
          Colors.widget[key as keyof typeof Colors.widget] === value) ||
        (Array.isArray(Colors.widget[key as keyof typeof Colors.widget]) &&
          Colors.widget[key as keyof typeof Colors.widget].includes(value)),
    ) as keyof typeof Colors.widget | undefined;

  /**
   * Focus effect to fetch tags when the component is focused.
   * This effect runs when the component is focused and retrieves all tags from the tag service.
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
   * Effect to add listeners for keyboard show and hide events to update the keyboardVisible state.
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
   * Effect to check the lastCreatedTag param for a valid JSON string.
   * If the param is a valid JSON string representing a tag, it sets the selectedTag
   */
  useEffect(() => {
    if (lastCreatedTagParam && typeof lastCreatedTagParam === "string") {
      try {
        const tag = JSON.parse(lastCreatedTagParam);
        if (tag && tag.tagID) {
          setData((prev: any) => ({
            ...prev,
            selectedTag: tag as TagDTO,
          }));
        }
      } catch (err) {
        console.warn("Invalid tag param:", err);
      }
    }
  }, [lastCreatedTagParam]);

  return (
    <>
      {isSmallScreen || isHighCard ? (
        <>
          <ScrollContainer showsVerticalScrollIndicator={false}>
            <View style={{ marginBottom: 20 }}>
              <Card>
                <IconTopRight onPress={() => setShowHelp(true)}>
                  <MaterialIcons
                    name="help-outline"
                    size={26}
                    color={
                      colorScheme === "light"
                        ? Colors.primary
                        : Colors.secondary
                    }
                  />
                </IconTopRight>
                <View style={{ alignItems: "center", gap: 20 }}>
                  <View style={{ alignSelf: "flex-start", marginLeft: 5 }}>
                    <ThemedText fontSize="l" fontWeight="bold">
                      Create Collection
                    </ThemedText>
                    <ThemedText
                      fontSize="s"
                      fontWeight="light"
                      colorVariant={
                        colorScheme === "light" ? "grey" : "lightGrey"
                      }
                    >
                      Design your new collection's widget
                    </ThemedText>
                  </View>
                  <Widget
                    title={title || "Title"}
                    label={selectedTag?.tag_label?.trim() || ""}
                    pageType={PageType.Collection}
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

            <ContentWrapper>
              <Card>
                <TitleCard
                  placeholder="Add a title"
                  value={title}
                  onChangeText={(text) => {
                    setData((prev: any) => ({ ...prev, title: text }));
                  }}
                  hasNoInputError={
                    hasClickedNext && (!data.title || data.title.trim() === "")
                  }
                />
                {/* Display error message if title is empty or only whitespace */}
                {titleError && (
                  <ThemedText
                    fontSize="s"
                    colorVariant="red"
                    style={{ marginTop: 5 }}
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
                    setData((prev: any) => ({
                      ...prev,
                      selectedTag:
                        tag && prev.selectedTag?.tagID === tag.tagID
                          ? null
                          : tag,
                    }));
                  }}
                  onViewAllPress={() => router.navigate("/tagManagement")}
                />
              </Card>

              <TwoColumnRow>
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
                    selectedIcon={selectedIcon}
                    onPress={() => {
                      setPopupType("icon");
                      setPopupVisible(true);
                    }}
                  />
                </View>
              </TwoColumnRow>
            </ContentWrapper>
          </ScrollContainer>
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
              <IconTopRight onPress={() => setShowHelp(true)}>
                <MaterialIcons
                  name="help-outline"
                  size={26}
                  color={
                    colorScheme === "light" ? Colors.primary : Colors.secondary
                  }
                />
              </IconTopRight>
              <View style={{ alignItems: "center", gap: 20 }}>
                <View style={{ alignSelf: "flex-start", marginLeft: 5 }}>
                  <ThemedText fontSize="l" fontWeight="bold">
                    Create Collection
                  </ThemedText>
                  <ThemedText
                    fontSize="s"
                    fontWeight="light"
                    colorVariant={
                      colorScheme === "light" ? "grey" : "lightGrey"
                    }
                  >
                    Design your new collection's widget
                  </ThemedText>
                </View>
                <Widget
                  title={title || "Title"}
                  label={selectedTag?.tag_label?.trim() || ""}
                  pageType={PageType.Collection}
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
          <ScrollContainer showsVerticalScrollIndicator={false}>
            <ContentWrapper>
              <Card>
                <TitleCard
                  placeholder="Add a title"
                  value={title}
                  onChangeText={(text) => {
                    setData((prev: any) => ({ ...prev, title: text }));
                  }}
                  hasNoInputError={
                    hasClickedNext && (!data.title || data.title.trim() === "")
                  }
                />
                {/* Display error message if title is empty or only whitespace */}
                {titleError && (
                  <ThemedText
                    fontSize="s"
                    colorVariant="red"
                    style={{ marginTop: 5 }}
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
                    setData((prev: any) => ({
                      ...prev,
                      selectedTag:
                        tag && prev.selectedTag?.tagID === tag.tagID
                          ? null
                          : tag,
                    }));
                  }}
                  onViewAllPress={() => router.navigate("/tagManagement")}
                />
              </Card>

              <TwoColumnRow>
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
                    selectedIcon={selectedIcon}
                    onPress={() => {
                      setPopupType("icon");
                      setPopupVisible(true);
                    }}
                  />
                </View>
              </TwoColumnRow>
            </ContentWrapper>
          </ScrollContainer>
        </>
      )}

      {/* Render the lists and templates if they exist */}
      {(Platform.OS !== "android" || !keyboardVisible) && (
        <View
          style={{
            paddingBottom: Platform.OS === "android" ? 8 : 24,
          }}
        >
          <BottomButtons
            titleLeftButton="Discard"
            titleRightButton="Next"
            onDiscard={() => {
              if (onBack) {
                onBack();
              } else {
                router.back();
              }
            }}
            onNext={() => {
              setHasClickedNext(true);
              if (!data.title || data.title.trim() === "") {
                showSnackbar(
                  "Please enter a title to continue.",
                  "bottom",
                  "error",
                );
                return;
              }
              onNext?.();
            }}
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
        selectedItem={
          popupType === "color"
            ? (selectedColor ?? null)
            : (selectedIcon ?? null)
        }
        onSelect={(itemValue) => {
          if (popupType === "color") {
            setData((prev: any) => ({ ...prev, selectedColor: itemValue }));
          } else {
            setData((prev: any) => ({
              ...prev,
              selectedIcon:
                prev.selectedIcon === itemValue
                  ? undefined
                  : (itemValue as keyof typeof MaterialIcons.glyphMap),
            }));
          }
        }}
        onClose={() => setPopupVisible(false)}
        onDone={() => setPopupVisible(false)}
      />
      {showHelp && (
        <InfoPopup
          visible={showHelp}
          onClose={() => setShowHelp(false)}
          image={require("@/assets/images/collection-guide.png")}
          title="What is a Collection?"
          description={`Collections let you group related Lists into a single custom page — perfect\u00A0for organizing similar Items together in one\u00A0place.\n\nFor example, you could create a Collection for your Books, add a special icon to make it stand out, and even use tags to keep things\u00A0organized.\nSimple! 📚`}
        />
      )}

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
    </>
  );
};

export default CreateCollection;
