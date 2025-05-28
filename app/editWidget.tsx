import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { NoteDTO } from "@/shared/dto/NoteDTO";
import { TagDTO } from "@/shared/dto/TagDTO";
import { ThemedText } from "@/components/ThemedText";
import { red } from "react-native-reanimated/lib/typescript/Colors";
import { DividerWithLabel } from "@/components/ui/DividerWithLabel/DividerWithLabel";
import { useFocusEffect } from "@react-navigation/native";
import { GeneralPageDTO } from "@/shared/dto/GeneralPageDTO";
import { set } from "date-fns";
import { GradientBackground } from "@/components/ui/GradientBackground/GradientBackground";
import { useActiveColorScheme } from "@/context/ThemeContext";
import BottomButtons from "@/components/ui/BottomButtons/BottomButtons";
import { PageType } from "@/shared/enum/PageType";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";
import { useServices } from "@/context/ServiceContext";
import { ServiceErrorType } from "@/shared/error/ServiceError";

export default function EditWidgetScreen() {
  const { generalPageService, tagService } = useServices();

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
  const pageType = pageData?.page_type ?? PageType.Note;
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

  const { showSnackbar } = useSnackbar();

  const initialValuesRef = useRef({
    title: "",
    selectedTag: null as TagDTO | null,
    selectedColor: "",
    selectedIcon: null as keyof typeof MaterialIcons.glyphMap | null,
  });

  const updateWidget = async () => {
    if (title.trim().length === 0) {
      setTitleError("Title is required.");
      showSnackbar("Please enter a title to continue.", "bottom", "error"); // ✅ Snackbar
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
    const result = await generalPageService.updateGeneralPageData(newPageDTO);

    if (result.success) {
      // only send snackbar if data has changed
      const hasChanges =
        title !== initialValuesRef.current.title ||
        selectedColor !== initialValuesRef.current.selectedColor ||
        selectedIcon !== initialValuesRef.current.selectedIcon ||
        (selectedTag?.tagID || null) !==
          (initialValuesRef.current.selectedTag?.tagID || null);

      if (hasChanges) {
        showSnackbar("Successfully updated Widget!", "bottom", "success");
      }

      router.back();
    } else {
      // TODO: show error modal
    }
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

      const fetchGeneralPage = async () => {
        try {
          const result = await generalPageService.getGeneralPageByID(
            Number(widgetID),
          );
          if (result.success) {
            setPageData(result.value);
            setTitle(result.value.page_title || "");
            setSelectedColor(result.value.page_color || "");
            setSelectedIcon(
              (result.value.page_icon as
                | keyof typeof MaterialIcons.glyphMap
                | null) || null,
            );
            //save current data to compare if new data has been entered
            initialValuesRef.current = {
              title: result.value.page_title || "",
              selectedColor: result.value.page_color || "",
              selectedIcon:
                (result.value
                  .page_icon as keyof typeof MaterialIcons.glyphMap) || null,
              selectedTag: result.value.tag || null,
            };

            setSelectedTag(result.value.tag || null);
          } else {
            // TODO: show error modal
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
      backgroundCardTopOffset={Platform.select({ ios: 100, android: 95 })}
      topPadding={Platform.select({ ios: 0, android: 15 })}
    >
      <View style={{ marginBottom: 8 }}>
        <Card>
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
                ) as keyof typeof Colors.widget) || "#4599E8"
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
    </GradientBackground>
  );
}
function setKeyboardVisible(arg0: boolean): void {
  throw new Error("Function not implemented.");
}
