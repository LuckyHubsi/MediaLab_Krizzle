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

/**
 * Component for rendering a card in the item template creation process.
 * It allows users to select item types: text, ratings, date, multi-select, image, and link.
 * Each item type includes a specific text field to input relevant information.
 * @param isTitleCard - Indicates if this is a title card (used for the first field, always there).
 * @param itemType - The type of item being created (text, rating, date, multi-select, image, link).
 * @param textfieldIcon - The icon to display in the text field.
 * @param isPreview - Indicates if the card is in preview mode. (maximum 3 cards can be previewed)
 * @param title - The title of the item.
 * @param rating - The rating icon for the item, if applicable.
 * @param options - The options for multi-select items.
 * @param onTypeChange - Callback function to handle changes in item type selection.
 * @param onTitleChange - Callback function to handle changes in the title input.
 * @param onRatingChange - Callback function to handle changes in the rating selection.
 * @param onOptionsChange - Callback function to handle changes in multi-select options.
 * @param onRemove - Callback function to handle the removal of the item.
 * @param onPreviewToggle - Callback function to toggle the preview mode.
 * @param hasNoInputError - Indicates if there is an error due to no input in the text field.
 * @param previewCount - The number of items currently in preview mode.
 * @param isExisting - Indicates if the item is an existing card field (used in edit mode).
 */

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
  let errorMessage = undefined;

  /**
   * Validates the options for multi-select items when the user has clicked next.
   * Checks for empty options, duplicates, and ensures at least one option is provided.
   */
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
        {/* Titles for each item card:
         * Title card (1st field) has "required" label,
         * already existing fields (in Edit Mode) show the field count and item type,
         * and new fields show only the field count. */}
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

        {/* Preview toggle button */}
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

      {/* Other cards (not title card/or already existing cards in edit mode) show the item type picker */}
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

      {/* Text field for title input */}
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

      {/* Show rating icons if item type is rating */}
      {itemType === "rating" && rating !== undefined && onRatingChange && (
        <TemplateRating
          title={"Rating Icon"}
          rating={rating}
          onRatingChange={onRatingChange}
        />
      )}

      {/* Show multi-select adding buttons if item type is multi-select */}
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
