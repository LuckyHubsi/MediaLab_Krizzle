import { ThemedText } from "@/components/ThemedText";
import Textfield from "@/components/ui/Textfield/Textfield";
import { MaterialIcons } from "@expo/vector-icons";
import React, { FC } from "react";
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
  isExisting?: boolean;
  fieldCount?: number;
  noSelectablesError?: boolean;
  hasClickedNext?: boolean;
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
  isExisting = false,
  fieldCount,
  noSelectablesError = false,
  hasClickedNext = false,
}) => {
  const colorScheme = useActiveColorScheme();

  const typeArray = [
    "item",
    "text",
    "date",
    "multi-select",
    "rating",
    "image",
    "link",
  ];
  const pickerStyles = getPickerStyles({ colorScheme: colorScheme ?? "light" });
  let errorMessage = undefined;

  if (hasClickedNext && itemType === "multi-select") {
    const trimmedOptions = (options ?? []).map((o) => o.trim());
    const lowerTrimmed = trimmedOptions
      .filter((o) => o !== "")
      .map((o) => o.toLowerCase());
    const hasTitle = !!title?.trim();
    const hasOptions = trimmedOptions.length > 0;
    const hasEmpty = trimmedOptions.some((o) => o === "");
    const hasDuplicates = new Set(lowerTrimmed).size !== lowerTrimmed.length;

    if (!hasOptions) {
      errorMessage = "Please add at least one selectable.";
    } else if (hasTitle && !hasOptions) {
      errorMessage = "Please add at least one selectable.";
    } else if (hasEmpty && hasDuplicates) {
      errorMessage =
        "Please fill out all selectable fields and ensure options are unique.";
    } else if (hasEmpty) {
      errorMessage = "Please fill out all selectable fields.";
    } else if (hasDuplicates) {
      errorMessage = "Options must be unique.";
    }
  }
  return (
    <TemplateSelectCard colorScheme={colorScheme}>
      <CardTitleRow>
        <CardTitle>
          {isTitleCard ? (
            <>
              <ThemedText>Field 1 </ThemedText>
              <ThemedText fontSize="s" colorVariant="red">
                * required
              </ThemedText>
            </>
          ) : isExisting ? (
            <>
              <ThemedText>Field {fieldCount} </ThemedText>
              <ThemedText fontSize="s" fontWeight="light">
                {itemType.charAt(0).toUpperCase() + itemType.slice(1)}
              </ThemedText>
            </>
          ) : (
            <ThemedText>Field {fieldCount}</ThemedText>
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
              color={
                colorScheme === "light" ? Colors.primary : Colors.secondary
              }
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
      {!isTitleCard && !isExisting && (
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
        textfieldIcon={
          itemType === "text"
            ? textfieldIcon
            : itemType === "image"
              ? "image"
              : itemType === "link"
                ? "link"
                : textfieldIcon
        }
        placeholderText={
          isTitleCard
            ? `E.g. "Title" or "Name"`
            : `Add a label to your ${itemType}`
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
          <>
            <AddMultiSelectables
              title=""
              options={options}
              onOptionsChange={onOptionsChange}
              errorMessage={errorMessage}
            />
          </>
        )}

      {!isTitleCard && <RemoveButton onPress={onRemove} />}
    </TemplateSelectCard>
  );
};

export default ItemTemplateCard;
