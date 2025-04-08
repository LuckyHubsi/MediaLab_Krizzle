import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import {
  Container,
  HeaderRow,
  Label,
  ViewAllText,
  TagScrollView,
  TagPill,
  TagText,
} from "./TagPicker.styles";
import { useColorScheme } from "@/hooks/useColorScheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface TagPickerProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string) => void;
  onViewAllPress: () => void;
}

export const TagPicker: React.FC<TagPickerProps> = ({
  tags,
  selectedTag,
  onSelectTag,
  onViewAllPress,
}) => {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <Container>
      <HeaderRow>
        <Label colorScheme={colorScheme}>Choose a Tag</Label>
        <TouchableOpacity onPress={onViewAllPress}>
          <ViewAllText colorScheme={colorScheme}>View all &gt;</ViewAllText>
        </TouchableOpacity>
      </HeaderRow>

      <TagScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tags.map((tag) => {
          const isSelected = selectedTag === tag;
          return (
            <TouchableOpacity key={tag} onPress={() => onSelectTag(tag)}>
              <TagPill isSelected={isSelected} colorScheme={colorScheme}>
                {isSelected && (
                  <MaterialIcons
                    name="check-circle"
                    size={16}
                    color="#FBFBFB"
                    style={{ marginRight: 10 }}
                  />
                )}
                <TagText isSelected={isSelected} colorScheme={colorScheme}>
                  {tag}
                </TagText>
              </TagPill>
            </TouchableOpacity>
          );
        })}
      </TagScrollView>
    </Container>
  );
};
