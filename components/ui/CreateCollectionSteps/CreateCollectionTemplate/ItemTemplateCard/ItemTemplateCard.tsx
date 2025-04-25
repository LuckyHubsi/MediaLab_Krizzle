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
import RemoveButton from "@/components/ui/RemoveButton/RemoveButton";

interface ItemTemplateCardProps {
  isTitleCard?: boolean;
  itemType: string;
  textfieldIcon: keyof typeof MaterialIcons.glyphMap;
  isPreview: boolean;
  onTypeChange?: (value: string) => void;
  onRemove?: () => void;
  onPreviewToggle?: () => void;
}

const ItemTemplateCard: FC<ItemTemplateCardProps> = ({
  isTitleCard,
  itemType,
  textfieldIcon,
  isPreview,
  onTypeChange,
  onRemove,
  onPreviewToggle,
}) => {
  const colorScheme = useColorScheme();

  const typeArray = ["item", "text", "date", "multi-select", "rating"];
  const pickerStyles = getPickerStyles({ colorScheme: colorScheme ?? "light" });

  console.log(isPreview, "isPreview");

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
        <CardPreview onPress={onPreviewToggle}>
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
          onValueChange={(value) => {
            if (onTypeChange) onTypeChange(value);
          }}
          style={pickerStyles}
          value={itemType}
          items={
            isTitleCard
              ? [{ label: "Text", value: "text" }]
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
        {!isTitleCard && <RemoveButton onPress={onRemove} />}
      </>
    </TemplateSelectCard>
  );
};

export default ItemTemplateCard;
