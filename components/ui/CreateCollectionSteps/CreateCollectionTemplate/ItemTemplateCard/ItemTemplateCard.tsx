import { ThemedText } from "@/components/ThemedText";
import Textfield from "@/components/ui/Textfield/Textfield";
import { MaterialIcons } from "@expo/vector-icons";
import React, { FC } from "react";
import RNPickerSelect from "react-native-picker-select";

import {
  TemplateSelectCard,
  CardTitleRow,
  CardTitle,
  CardPreview,
} from "./ItemTemplateCard.styles";
import { Colors } from "@/constants/Colors";
import { getPickerStyles } from "@/components/ui/CollectionListDropdown/CollectionListDropdown.styles";
import { useColorScheme } from "@/hooks/useColorScheme";

interface ItemTemplateCardProps {
  isTitleCard?: boolean;
}

const ItemTemplateCard: FC<ItemTemplateCardProps> = ({ isTitleCard }) => {
  const colorScheme = useColorScheme();

  const textfieldIconArray: ("short-text" | "calendar-today" | "layers")[] = [
    "short-text",
    "calendar-today",
    "layers",
  ];
  const typeArray = ["item", "text", "date", "multi-select", "rating"];
  const isPreview = true;

  const pickerStyles = getPickerStyles({ colorScheme: colorScheme ?? "light" });

  return (
    <TemplateSelectCard colorScheme={colorScheme}>
      <CardTitleRow>
        <CardTitle>
          {isTitleCard ? (
            <>
              <ThemedText>Title</ThemedText>
              <ThemedText fontSize="s" colorVariant="red">
                * required
              </ThemedText>
            </>
          ) : (
            <ThemedText>Type</ThemedText>
          )}
        </CardTitle>
        <CardPreview>
          <ThemedText>Item Preview</ThemedText>
          {isPreview ? (
            <MaterialIcons
              name="check-circle"
              size={20}
              color={Colors.primary}
            />
          ) : (
            <MaterialIcons
              name="radio-button-off"
              color={Colors[colorScheme ?? "light"].text}
              size={20}
            />
          )}
        </CardPreview>
      </CardTitleRow>
      <>
        <RNPickerSelect
          style={pickerStyles}
          onValueChange={() => {}}
          items={typeArray
            .filter((item) => item !== "item")
            .map((item) => ({
              label: item,
              value: item,
            }))}
          placeholder={{ label: "Select an option...", value: null }}
          Icon={() => <MaterialIcons name="arrow-drop-down" size={24} />}
        />
        <Textfield
          showTitle={false}
          textfieldIcon={textfieldIconArray[1]}
          placeholderText={`Add a title to your ${typeArray[4]}`}
          title={""}
        />
      </>
    </TemplateSelectCard>
  );
};

export default ItemTemplateCard;
