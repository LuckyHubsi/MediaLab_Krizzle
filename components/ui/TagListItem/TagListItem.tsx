import React from "react";
import { TouchableOpacity } from "react-native";
import { Row, Column, IconRow } from "./TagListItem.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { ThemedText } from "@/components/ThemedText";

interface Props {
  tag: string;
  onEdit: () => void;
  onDelete: () => void;
  tagCount?: number;
}

export const TagListItem: React.FC<Props> = ({
  tag,
  onEdit,
  onDelete,
  tagCount,
}) => {
  const colorScheme = useActiveColorScheme() ?? "light";

  return (
    <Row>
      <Column>
        <ThemedText>{tag}</ThemedText>
        {tagCount !== undefined && tagCount > 0 ? (
          <ThemedText
            fontSize="s"
            fontWeight="light"
            colorVariant="lightGrey"
          >{`Used in ${tagCount} ${tagCount === 1 ? "Widget" : "Widgets"}`}</ThemedText>
        ) : (
          <ThemedText fontSize="s" fontWeight="light" colorVariant="lightGrey">
            Unused
          </ThemedText>
        )}
      </Column>
      <IconRow>
        <TouchableOpacity onPress={onEdit} style={{ marginRight: 16 }}>
          <MaterialIcons
            name="edit"
            size={24}
            color={colorScheme === "light" ? "#000" : "#fff"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <MaterialIcons
            name="close"
            size={24}
            color={colorScheme === "light" ? "#d00" : "#f66"}
          />
        </TouchableOpacity>
      </IconRow>
    </Row>
  );
};
