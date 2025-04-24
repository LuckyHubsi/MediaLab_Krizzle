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
  itemType: string;
  textfieldIcon: keyof typeof MaterialIcons.glyphMap;
  isPreview: boolean;
}

const ItemTemplateCard: FC<ItemTemplateCardProps> = ({
  isTitleCard,
  itemType,
  textfieldIcon,
  isPreview,
}) => {
  const colorScheme = useColorScheme();

  const typeArray = ["item", "text", "date", "multi-select", "rating"];
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
          onValueChange={() => {}}
          style={pickerStyles}
          value={isTitleCard ? typeArray[1] : undefined}
          items={
            isTitleCard
              ? [
                  {
                    label: "Text",
                    value: "text",
                  },
                ]
              : typeArray
                  .filter((item) => item !== "item")
                  .map((item) => ({
                    label: item,
                    value: item,
                  }))
          }
          {...(!isTitleCard && {
            Icon: () => <MaterialIcons name="arrow-drop-down" size={24} />,
          })}
        />
        <Textfield
          showTitle={false}
          textfieldIcon={textfieldIcon}
          placeholderText={`Add a title to your ${itemType}`}
          title={""}
        />
      </>
    </TemplateSelectCard>
  );
};

export default ItemTemplateCard;
