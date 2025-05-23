import { ThemedText } from "@/components/ThemedText";
import Textfield from "@/components/ui/Textfield/Textfield";
import { MaterialIcons } from "@expo/vector-icons";
import React, { FC, useState } from "react";
import RNPickerSelect from "react-native-picker-select";

import {
  TemplateSelectCard,
  CardTitleRow,
  CardTitle,
  CardPreview,
} from "./ItemTemplateCard.styles";
import { Colors } from "@/constants/Colors";
import {
  AndroidPickerWrapper,
  getPickerStyles,
} from "@/components/ui/CollectionListDropdown/CollectionListDropdown.styles";
import RemoveButton from "@/components/ui/RemoveButton/RemoveButton";
import TemplateRating from "./TemplateRating";
import AddMultiSelectables from "./AddMultiSelectables";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { Platform } from "react-native";
import CustomPicker from "@/components/ui/CustomPicker/CustomPicker";

interface ItemTemplateCardProps {
  isTitleCard?: boolean;
  itemType: string;
  textfieldIcon: keyof typeof MaterialIcons.glyphMap;
  isPreview: boolean;
  title?: string;
  rating?: keyof typeof MaterialIcons.glyphMap;
  options?: string[];
  onTypeChange?: (value: string) => void;
  onTitleChange?: (text: string) => void;
  onRatingChange?: (rating: keyof typeof MaterialIcons.glyphMap) => void;
  onOptionsChange?: (options: string[]) => void;
  onRemove?: () => void;
  onPreviewToggle?: () => void;
  hasNoInputError?: boolean;
  hasNoMultiSelectableError?: boolean;
  previewCount?: number;
}

const ItemTemplateCard: FC<ItemTemplateCardProps> = ({
  isTitleCard,
  itemType,
  textfieldIcon,
  isPreview,
  title,
  rating,
  options,
  onTypeChange,
  onTitleChange,
  onRatingChange,
  onOptionsChange,
  onRemove,
  onPreviewToggle,
  hasNoInputError,
  hasNoMultiSelectableError,
  previewCount,
}) => {
  const colorScheme = useActiveColorScheme();

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
        <CardPreview onPress={onPreviewToggle}>
          <ThemedText
            colorVariant={
              isPreview
                ? "default"
                : previewCount && previewCount > 2
                  ? "grey"
                  : "default"
            }
          >
            Item Preview
          </ThemedText>
          {isPreview ? (
            <MaterialIcons
              name="check-circle"
              size={20}
              color={Colors.primary}
            />
          ) : (
            <MaterialIcons
              name="radio-button-off"
              color={
                isPreview
                  ? Colors[colorScheme ?? "light"].text
                  : previewCount && previewCount > 2
                    ? Colors.grey50
                    : Colors[colorScheme].text
              }
              size={20}
            />
          )}
        </CardPreview>
      </CardTitleRow>
      {!isTitleCard && (
        <AndroidPickerWrapper colorScheme={colorScheme}>
          <CustomPicker
            value={itemType}
            onValueChange={(value) => {
              if (onTypeChange) onTypeChange(value as string);
            }}
            items={typeArray
              .filter((item) => item !== "item")
              .map((item) => ({
                label: item.charAt(0).toUpperCase() + item.slice(1),
                value: item,
              }))}
            placeholder={{ label: "Select item", value: "" }}
            colorScheme={colorScheme}
          />
        </AndroidPickerWrapper>
      )}

      <Textfield
        showTitle={false}
        textfieldIcon={textfieldIcon}
        placeholderText={
          isTitleCard
            ? "Add a title to your item"
            : `Add a title to your ${itemType}`
        }
        title={""}
        value={title || ""}
        onChangeText={(text) => onTitleChange?.(text)}
        hasNoInputError={hasNoInputError}
        maxLength={30}
      />

      {itemType === "rating" && rating !== undefined && onRatingChange && (
        <TemplateRating
          title={"Rating Icon"}
          rating={rating}
          onRatingChange={onRatingChange}
        />
      )}

      {itemType === "multi-select" &&
        options !== undefined &&
        onOptionsChange && (
          <AddMultiSelectables
            title=""
            options={options}
            onOptionsChange={onOptionsChange}
            hasNoInputError={hasNoMultiSelectableError}
          />
        )}

      {!isTitleCard && <RemoveButton onPress={onRemove} />}
    </TemplateSelectCard>
  );
};

export default ItemTemplateCard;
