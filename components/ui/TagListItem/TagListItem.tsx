import React from "react";
import { TouchableOpacity } from "react-native";
import { Row, IconRow } from "./TagListItem.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { ThemedText } from "@/components/ThemedText";

interface Props {
  tag: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const TagListItem: React.FC<Props> = ({ tag, onEdit, onDelete }) => {
  const colorScheme = useActiveColorScheme() ?? "light";

  return (
    <Row>
      <ThemedText>{tag}</ThemedText>
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
