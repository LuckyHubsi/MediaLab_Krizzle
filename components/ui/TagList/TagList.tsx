import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { TagButton, TagText, TagContainer } from "./TagList.styles";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { TagDTO } from "@/shared/dto/TagDTO";
import { Colors } from "react-native/Libraries/NewAppScreen";

/**
 * Component for displaying a list of tags with selection functionality.
 *
 * @param tags (required) - Array of TagDTO objects to display.
 * @param onSelect - Callback function to handle tag selection.
 * @param onPress - Callback function for when the edit button is pressed.
 */

type TagListProps = {
  tags: TagDTO[];
  onSelect?: (selected: TagDTO | "All") => void;
  onPress?: () => void;
};

const TagList: React.FC<TagListProps> = ({ tags, onSelect, onPress }) => {
  const [activeTag, setActiveTag] = useState<TagDTO | "All">("All");
  const colorScheme = useActiveColorScheme() ?? "light";

  /**
   * Effect to reset the active tag to "All" if no tags are provided.
   * This ensures that the component behaves correctly when there are no tags.
   */
  useEffect(() => {
    if (tags.length === 0) {
      setActiveTag("All");
      onSelect?.("All");
    }
  }, [tags, onSelect]);

  /**
   * Handles the press event for a tag.
   * If the currently active tag is pressed again, it resets to "All".
   * Otherwise, it sets the active tag to the pressed tag.
   *
   * @param tag - The TagDTO object that was pressed.
   */
  const handlePress = (tag: TagDTO) => {
    if (activeTag !== "All" && activeTag.tagID === tag.tagID) {
      setActiveTag("All");
      onSelect?.("All");
    } else {
      setActiveTag(tag);
      onSelect?.(tag);
    }
  };

  /**
   * Checks if a tag is currently active.
   *
   * @param tag - The TagDTO object to check.
   * @returns True if the tag is active, false otherwise.
   */
  const isActive = (tag: TagDTO) =>
    activeTag !== "All" && activeTag?.tagID === tag.tagID;

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tags.length !== 0 && (
          <TagContainer onPress={onPress}>
            <TagButton
              themeMode={colorScheme}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Edit tags"
              accessibilityHint="Opens the Tag Management page"
            >
              <MaterialIcons
                name="edit"
                size={16}
                color={colorScheme === "dark" ? Colors.white : Colors.black}
              />
            </TagButton>
          </TagContainer>
        )}

        <View
          accessible={true}
          accessibilityRole="radiogroup"
          accessibilityLabel="Tag Filtering Section"
          style={{
            flexDirection: "row",
          }}
        >
          {/* Mapped Tags */}
          {tags.map((tag) => (
            <TagContainer
              onPress={() => handlePress(tag)}
              key={tag.tagID}
              activeOpacity={0.7}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Filter by tag ${tag.tag_label}`}
              accessibilityState={{ selected: isActive(tag) }}
            >
              <TagButton active={isActive(tag)} themeMode={colorScheme}>
                {isActive(tag) && (
                  <MaterialIcons
                    name="check-circle"
                    size={16}
                    color={Colors.white}
                    style={{ marginRight: 5 }}
                  />
                )}
                <TagText active={isActive(tag)} themeMode={colorScheme}>
                  {tag.tag_label}
                </TagText>
              </TagButton>
            </TagContainer>
          ))}
        </View>

        {/* Fallback when empty */}
        {tags.length === 0 && (
          <TagContainer onPress={onPress}>
            <TagButton
              themeMode={colorScheme}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Edit tags"
              accessibilityHint="Opens the Tag Management page"
            >
              <MaterialIcons
                name="edit"
                size={16}
                color={colorScheme === "dark" ? Colors.white : Colors.black}
                style={{ marginRight: 5 }}
              />
              <TagText themeMode={colorScheme}>Edit Tags</TagText>
            </TagButton>
          </TagContainer>
        )}
      </ScrollView>
    </View>
  );
};

export default TagList;
