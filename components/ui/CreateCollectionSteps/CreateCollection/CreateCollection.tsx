import React, { FC, useState } from "react";
import { router } from "expo-router";
import { useColorScheme, View } from "react-native";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { Card } from "@/components/ui/Card/Card";
import { Header } from "@/components/ui/Header/Header";
import Widget from "@/components/ui/Widget/Widget";
import { TitleCard } from "@/components/ui/TitleCard/TitleCard";
import { TagPicker } from "@/components/ui/TagPicker/TagPicker";
import { ChooseCard } from "@/components/ui/ChooseCard/ChooseCard";
import { ChoosePopup } from "@/components/ui/ChoosePopup/ChoosePopup";
import { Button } from "@/components/ui/Button/Button";
import { DividerWithLabel } from "@/components/ui/DividerWithLabel/DividerWithLabel";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { colorLabelMap, iconLabelMap } from "@/constants/LabelMaps";
import { Icons } from "@/constants/Icons";
import { NoteDTO } from "@/dto/NoteDTO";
import { PageType } from "@/utils/enums/PageType";
import { insertNote } from "@/services/NoteService";
import { TagDTO } from "@/dto/TagDTO";
import { ThemedText } from "@/components/ThemedText";
import {
  Container,
  ScrollContainer,
  ContentWrapper,
  TwoColumnRow,
  ButtonContainer,
} from "./CreateCollection.styles";
import { de } from "date-fns/locale";

const CreateCollection: FC = () => {
  const colorScheme = useColorScheme();
  const [title, setTitle] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedIcon, setSelectedIcon] = useState<
    keyof typeof MaterialIcons.glyphMap | undefined
  >(undefined);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState<"color" | "icon">("color");

  const tags = ["Work", "Personal", "Urgent", "Ideas"];

  const selectedColorLabel = colorLabelMap[selectedColor] || "Choose Color";
  const selectedIconLabel = selectedIcon
    ? iconLabelMap[selectedIcon]
    : "Choose Icon";

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

  //   const createNote = async () => {
  //     if (title.trim().length === 0) {
  //       setTitleError("Title is required.");
  //       return;
  //     }

  //     setTitleError(null);

  //     const tagDTO: TagDTO | null = selectedTag
  //       ? { tag_label: selectedTag }
  //       : null;

  //     const noteDTO: NoteDTO = {
  //       page_type: PageType.Note,
  //       page_title: title,
  //       page_icon: selectedIcon,
  //       page_color: (selectedColor as keyof typeof Colors.widget) || "blue",
  //       archived: false,
  //       pinned: false,
  //       note_content: null,
  //       tag: tagDTO,
  //     };

  //     const id = await insertNote(noteDTO);
  //     router.replace({ pathname: "/notePage", params: { id, title } });
  //   };

  return (
    <>
      <ScrollContainer>
        <ContentWrapper>
          <Card>
            <Header
              title="Create Collection"
              onIconPress={() => alert("Popup!")}
            />
            <Widget
              title={title || "Title"}
              label={selectedTag ?? "No tag"}
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
                ) as keyof typeof Colors.widget) || "blue"
              }
            />
          </Card>

          <Card>
            <TitleCard
              placeholder="Add a title to your Note"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (text.trim().length > 0) setTitleError(null);
              }}
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
              onSelectTag={(tag) =>
                setSelectedTag((prevTag) => (prevTag === tag ? null : tag))
              }
              onViewAllPress={() => router.push("/tagManagement")}
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
                selectedColor={
                  useColorScheme() === "dark"
                    ? Colors.dark.cardBackground
                    : Colors.light.cardBackground
                }
                selectedIcon={selectedIcon}
                onPress={() => {
                  setPopupType("icon");
                  setPopupVisible(true);
                }}
              />
            </View>
          </TwoColumnRow>

          <ButtonContainer>
            <Button onPress={() => console.log("Collection created")}>
              Create
            </Button>
          </ButtonContainer>
        </ContentWrapper>
      </ScrollContainer>
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
            setSelectedColor(itemValue);
          } else {
            setSelectedIcon(
              itemValue
                ? (itemValue as keyof typeof MaterialIcons.glyphMap)
                : undefined,
            );
          }
        }}
        onClose={() => setPopupVisible(false)}
        onDone={() => setPopupVisible(false)}
      />
    </>
  );
};

export default CreateCollection;
