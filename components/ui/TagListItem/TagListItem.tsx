import React from "react";
import { TouchableOpacity } from "react-native";
import { Row, Column, IconRow } from "./TagListItem.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";

/**
 * Component for displaying a tag in the Tag Management with options to edit or delete it.
 *
 * @param tag (required) - The name of the tag to display.
 * @param onEdit (required) - Callback function to handle editing the tag.
 * @param onDelete (required) - Callback function to handle deleting the tag.
 * @param tagCount - Count of how many widgets use this tag.
 * @param tagCountLoading - Boolean to indicate if the tag count is still loading.
 */

interface Props {
  tag: string;
  onEdit: () => void;
  onDelete: () => void;
  tagCount?: number;
  tagCountLoading?: boolean;
}

export const TagListItem: React.FC<Props> = ({
  tag,
  onEdit,
  onDelete,
  tagCount,
  tagCountLoading = true,
}) => {
  const colorScheme = useActiveColorScheme() ?? "light";

  return (
    <Row>
      <Column style={{ marginLeft: 14 }}>
        <ThemedText
          style={{
            flexWrap: "wrap",
            flexShrink: 1,
          }}
        >
          {tag}
        </ThemedText>
        {tagCount !== undefined && tagCount > 0 ? (
          <ThemedText
            fontSize="s"
            fontWeight="light"
            colorVariant="greyScale"
          >{`Used in ${tagCount} ${tagCount === 1 ? "Widget" : "Widgets"}`}</ThemedText>
        ) : !tagCountLoading ? null : (
          <ThemedText fontSize="s" fontWeight="light" colorVariant="greyScale">
            Unused
          </ThemedText>
        )}
      </Column>
      <IconRow>
        <TouchableOpacity
          onPress={onEdit}
          style={{
            height: 48,
            width: 48,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialIcons
            name="edit"
            size={24}
            color={colorScheme === "light" ? Colors.black : Colors.white}
            accessibilityLabel="Edit tag"
            accessibilityHint="Edit the tag name"
            accessibilityRole="button"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDelete}
          style={{
            height: 48,
            width: 48,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialIcons
            name="delete"
            size={24}
            color={Colors[colorScheme].negative}
            accessibilityLabel="Delete tag"
            accessibilityHint="Delete the tag"
            accessibilityRole="button"
          />
        </TouchableOpacity>
      </IconRow>
    </Row>
  );
};
