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
      <Column>
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
            colorVariant="disabled"
          >{`Used in ${tagCount} ${tagCount === 1 ? "Widget" : "Widgets"}`}</ThemedText>
        ) : !tagCountLoading ? null : (
          <ThemedText fontSize="s" fontWeight="light" colorVariant="disabled">
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
