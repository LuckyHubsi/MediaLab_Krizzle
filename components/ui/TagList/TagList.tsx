import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { TagButton, TagText } from "./TagList.styles";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { TagDTO } from "@/shared/dto/TagDTO";

type TagListProps = {
  tags: TagDTO[];
  onSelect?: (selected: TagDTO | "All") => void;
  onPress?: () => void;
};

const TagList: React.FC<TagListProps> = ({ tags, onSelect, onPress }) => {
  const [activeTag, setActiveTag] = useState<TagDTO | "All">("All");
  const themeMode = useActiveColorScheme() ?? "light";

  useEffect(() => {
    if (tags.length === 0) {
      setActiveTag("All");
      onSelect?.("All");
    }
  }, [tags, onSelect]);

  const handlePress = (tag: TagDTO) => {
    setActiveTag(tag);
    onSelect?.(tag);
  };

  const handleAllPress = () => {
    setActiveTag("All");
    onSelect?.("All");
  };

  const isActive = (tag: TagDTO) =>
    activeTag !== "All" && activeTag?.tagID === tag.tagID;

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TagButton
          key="all"
          active={activeTag === "All"}
          themeMode={themeMode}
          onPress={handleAllPress}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="All tags"
          accessibilityState={{ selected: activeTag === "All" }}
          accessibilityHint="Filters notes by all tags"
        >
          {activeTag === "All" && (
            <MaterialIcons
              name="check-circle"
              size={16}
              color="#FBFBFB"
              style={{ marginRight: 10 }}
            />
          )}
          <TagText active={activeTag === "All"} themeMode={themeMode}>
            All
          </TagText>
        </TagButton>

        {tags.length !== 0 && (
          <TagButton themeMode={themeMode} onPress={onPress}>
            <MaterialIcons
              name="add"
              size={16}
              color={themeMode === "dark" ? "#FBFBFB" : "#000"}
            />
          </TagButton>
        )}

        {tags.map((tag) => (
          <TagButton
            key={tag.tagID}
            active={isActive(tag)}
            themeMode={themeMode}
            onPress={() => handlePress(tag)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Tag: ${tag.tag_label}`}
            accessibilityState={{ selected: isActive(tag) }}
            accessibilityHint={`Filters notes by the ${tag.tag_label} tag`}
          >
            {isActive(tag) && (
              <MaterialIcons
                name="check-circle"
                size={16}
                color="#FBFBFB"
                style={{ marginRight: 5 }}
              />
            )}
            <TagText active={isActive(tag)} themeMode={themeMode}>
              {tag.tag_label}
            </TagText>
          </TagButton>
        ))}

        {tags.length === 0 && (
          <TagButton
            themeMode={themeMode}
            onPress={onPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Add a new tag"
            accessibilityHint="Opens the tag management screen"
          >
            <MaterialIcons
              name="add"
              size={16}
              color={themeMode === "dark" ? "#FBFBFB" : "#000"}
              style={{ marginRight: 5 }}
            />
            <TagText themeMode={themeMode}>Add a tag</TagText>
          </TagButton>
        )}
      </ScrollView>
    </View>
  );
};

export default TagList;
