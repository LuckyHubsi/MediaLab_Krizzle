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
import { Colors } from "@/constants/Colors";

/**
 * Component for selecting a tag from a list of available tags in the create/edit widget flow.
 *
 * @param tags (required) - Array of TagDTO objects to display.
 * @param selectedTag (required) - The currently selected tag, or null if none is selected.
 * @param onSelectTag (required) - Callback function to handle tag selection.
 * @param onViewAllPress (required) - Callback function for when the "Edit Tags" button is pressed.
 *
 */

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
  const colorScheme = useActiveColorScheme() ?? "light";

  return (
    <Container>
      <HeaderRow>
        <ThemedText
          fontSize="regular"
          fontWeight="regular"
          accessibilityRole="header"
        >
          Choose a Tag
        </ThemedText>
        <EditTextContainer>
          <ThemedText
            fontSize="s"
            fontWeight="regular"
            colorVariant="greyScale"
            onPress={onViewAllPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Edit Tags"
            accessibilityHint="Opens the Tag Management page"
          >
            Edit Tags
            <BackIcon
              name="chevron-forward-outline"
              colorScheme={colorScheme}
            />
          </ThemedText>
        </EditTextContainer>
      </HeaderRow>

      <TagScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        accessible={true}
        accessibilityRole="radiogroup"
        accessibilityLabel="Tag Selection Section"
      >
        {tags.map((tag) => {
          const isSelected = selectedTag?.tagID === tag.tagID;
          return (
            <TouchableOpacity
              key={tag.tagID}
              onPress={() => {
                if (isSelected) {
                  onSelectTag(null);
                } else {
                  onSelectTag(tag);
                }
              }}
              style={{
                height: 48,
                alignItems: "center",
                marginRight: 4,
                justifyContent: "center",
              }}
              accessible={true}
              accessibilityRole="radio"
              accessibilityLabel={`Tag ${tag.tag_label}`}
              accessibilityState={{ selected: isSelected }}
            >
              <TagPill isSelected={isSelected} colorScheme={colorScheme}>
                {isSelected && (
                  <MaterialIcons
                    name="check-circle"
                    size={16}
                    color={Colors.white}
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
          <TouchableOpacity
            onPress={() => onViewAllPress()}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Edit Tags`}
            accessibilityHint="Opens the Tag Management page for adding your first tag."
          >
            <TagPill onPress={onViewAllPress} colorScheme={colorScheme}>
              <MaterialIcons
                name="edit"
                size={16}
                color={colorScheme === "dark" ? Colors.white : Colors.black}
                style={{ marginRight: 5 }}
              />
              <ThemedText fontSize="s" fontWeight="regular">
                Edit Tags
              </ThemedText>
            </TagPill>
          </TouchableOpacity>
        )}
      </TagScrollView>
    </Container>
  );
};
