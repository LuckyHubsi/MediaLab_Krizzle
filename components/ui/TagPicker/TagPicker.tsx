import React from "react";
import { TouchableOpacity } from "react-native";
import {
  Container,
  HeaderRow,
  TagScrollView,
  TagPill,
  BackIcon,
  EditTextContainer,
} from "./TagPicker.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedText } from "@/components/ThemedText";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { TagDTO } from "@/shared/dto/TagDTO";

interface TagPickerProps {
  tags: TagDTO[];
  selectedTag: TagDTO | null;
  onSelectTag: (tag: TagDTO | null) => void;
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
        <EditTextContainer onPress={onViewAllPress}>
          <ThemedText
            fontSize="s"
            fontWeight="regular"
            colorVariant="greyScale"
          >
            Edit Tags
            <BackIcon name="chevron-forward-outline" colorScheme={themeMode} />
          </ThemedText>
        </EditTextContainer>
      </HeaderRow>

      <TagScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tags.map((tag) => {
          const isSelected = selectedTag?.tagID === tag.tagID;
          return (
            <TouchableOpacity
              key={tag.tagID}
              onPress={() => {
                if (isSelected) {
                  onSelectTag(null); // Deselect
                } else {
                  onSelectTag(tag); // Select
                }
              }}
              style={{
                height: 48,
                alignItems: "center",
                marginRight: 4,
                justifyContent: "center",
              }}
            >
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
                name="edit"
                size={16}
                color={themeMode === "dark" ? "#FBFBFB" : "#000"}
                style={{ marginRight: 5 }}
              />
              <ThemedText>Edit Tags</ThemedText>
            </TagPill>
          </TouchableOpacity>
        )}
      </TagScrollView>
    </Container>
  );
};
