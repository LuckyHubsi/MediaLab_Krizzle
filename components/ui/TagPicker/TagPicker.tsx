import React from "react";
import { TouchableOpacity } from "react-native";
import {
  Container,
  HeaderRow,
  TagScrollView,
  TagPill,
  BackIcon,
} from "./TagPicker.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedText } from "@/components/ThemedText";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { TagDTO } from "@/shared/dto/TagDTO";

interface TagPickerProps {
  tags: TagDTO[];
  selectedTag: TagDTO | null;
  onSelectTag: (tag: TagDTO) => void;
  onViewAllPress: () => void;
}

export const TagPicker: React.FC<TagPickerProps> = ({
  tags,
  selectedTag,
  onSelectTag,
  onViewAllPress,
}) => {
  const themeMode = useActiveColorScheme() ?? "light";

  return (
    <Container>
      <HeaderRow>
        <ThemedText fontSize="regular" fontWeight="regular">
          Choose a Tag
        </ThemedText>
        <TouchableOpacity onPress={onViewAllPress}>
          <ThemedText fontSize="s" fontWeight="regular" colorVariant="viewAll">
            Edit Tags
            <BackIcon name="chevron-forward-outline" colorScheme={themeMode} />
          </ThemedText>
        </TouchableOpacity>
      </HeaderRow>

      <TagScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tags.map((tag) => {
          const isSelected = selectedTag?.tagID === tag.tagID;
          return (
            <TouchableOpacity key={tag.tagID} onPress={() => onSelectTag(tag)}>
              <TagPill isSelected={isSelected} colorScheme={themeMode}>
                {isSelected && (
                  <MaterialIcons
                    name="check-circle"
                    size={16}
                    color="#FBFBFB"
                    style={{ marginRight: 10 }}
                  />
                )}
                <ThemedText
                  fontSize="s"
                  fontWeight="regular"
                  colorVariant={isSelected ? "white" : undefined}
                >
                  {tag.tag_label}
                </ThemedText>
              </TagPill>
            </TouchableOpacity>
          );
        })}
        {tags.length === 0 && (
          <TouchableOpacity onPress={() => onViewAllPress()}>
            <TagPill onPress={onViewAllPress} colorScheme={themeMode}>
              <MaterialIcons
                name="add"
                size={16}
                color={themeMode === "dark" ? "#FBFBFB" : "#000"}
                style={{ marginRight: 5 }}
              />
              <ThemedText>Add a tag</ThemedText>
            </TagPill>
          </TouchableOpacity>
        )}
      </TagScrollView>
    </Container>
  );
};
