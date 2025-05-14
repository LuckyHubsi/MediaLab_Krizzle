import React, { FC, useCallback, useEffect, useState } from "react";
import { router } from "expo-router";
import {
  Alert,
  Keyboard,
  Platform,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Card } from "@/components/ui/Card/Card";
import { Header } from "@/components/ui/Header/Header";
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
  ButtonContainer,
} from "./CreateCollection.styles";
import { InfoPopup } from "@/components/Modals/InfoModal/InfoModal";
import { IconTopRight } from "../../IconTopRight/IconTopRight";
import BottomButtons from "../../BottomButtons/BottomButtons";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { TagDTO } from "@/dto/TagDTO";
import { PageType } from "@/utils/enums/PageType";
import { useFocusEffect } from "@react-navigation/native";
import { getAllTags } from "@/services/TagService";

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
  onNext,
}) => {
  const colorScheme = useActiveColorScheme();
  const title = data.title;
  const selectedTag = data.selectedTag;
  const selectedColor = data.selectedColor;
  const selectedIcon = data.selectedIcon;

  const [hasClickedNext, setHasClickedNext] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState<"color" | "icon">("color");
  const [showHelp, setShowHelp] = useState(false);
  const [tags, setTags] = useState<TagDTO[]>([]);
  const iconColor =
    colorScheme === "dark" ? Colors.dark.text : Colors.light.text;
  const selectedColorLabel = colorLabelMap[selectedColor] || "Choose Color";
  const selectedIconLabel = selectedIcon
    ? iconLabelMap[selectedIcon]
    : "Choose Icon";
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const colorOptions = Object.entries(Colors.widget).map(([key, value]) => ({
    id: key,
    color: value,
    value: key,
    label: colorLabelMap[Array.isArray(value) ? value[0] : value] ?? key,
  }));

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
    <>
      <View style={{ marginBottom: 8 }}>
        <Card>
          <IconTopRight>
            <TouchableOpacity onPress={() => setShowHelp(true)}>
              <MaterialIcons
                name="help-outline"
                size={26}
                color={Colors.primary}
              />
            </TouchableOpacity>
          </IconTopRight>
          <View style={{ alignItems: "center", gap: 20 }}>
            <Header
              title="Create Collection"
              onIconPress={() => alert("Popup!")}
            />
            <Widget
              title={title || "Title"}
              label={selectedTag?.tag_label?.trim() || ""}
              pageType={PageType.Collection}
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
      <ScrollContainer showsVerticalScrollIndicator={false}>
        <ContentWrapper>
          <Card>
            <TitleCard
              placeholder="Add a title to your Note"
              value={title}
              onChangeText={(text) => {
                setData((prev: any) => ({ ...prev, title: text }));
              }}
              hasNoInputError={
                hasClickedNext && (!data.title || data.title.trim() === "")
              }
            />
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
                    prev.selectedTag?.tagID === tag.tagID ? null : tag,
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
      {(Platform.OS !== "android" || !keyboardVisible) && (
        <ButtonContainer>
          <BottomButtons
            variant={"back"}
            titleLeftButton={"Back"}
            titleRightButton={"Add"}
            singleButtonText={"Next"}
            onNext={() => {
              setHasClickedNext(true);
              if (!data.title || data.title.trim() === "") {
                Alert.alert("Please fill in the title before continuing.");
                return;
              }
              onNext?.();
            }}
            hasProgressIndicator={false}
            progressStep={1}
          />
        </ButtonContainer>
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
    </>
  );
};

export default CreateCollection;
function setKeyboardVisible(arg0: boolean): void {
  throw new Error("Function not implemented.");
}
