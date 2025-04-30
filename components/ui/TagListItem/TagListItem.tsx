import React from "react";
import { TouchableOpacity } from "react-native";
import { Row, TagText, IconRow } from "./TagListItem.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useActiveColorScheme } from "@/context/ThemeContext";

interface Props {
  tag: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const TagListItem: React.FC<Props> = ({ tag, onEdit, onDelete }) => {
  const colorScheme = useActiveColorScheme() ?? "light";

  return (
    <Row>
      <TagText colorScheme={colorScheme}>{tag}</TagText>
      <IconRow>
        <TouchableOpacity onPress={onEdit} style={{ marginRight: 16 }}>
          <MaterialIcons
            name="edit"
            size={20}
            color={colorScheme === "light" ? "#000" : "#fff"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <MaterialIcons
            name="close"
            size={20}
            color={colorScheme === "light" ? "#d00" : "#f66"}
          />
        </TouchableOpacity>
      </IconRow>
    </Row>
  );
};
