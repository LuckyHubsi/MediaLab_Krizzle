import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { TagButton, TagText, TagContainer } from "./TagList.styles";
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
        {/* "All" Button */}
        <TagContainer onPress={handleAllPress} key="all" activeOpacity={0.7}>
          <TagButton active={activeTag === "All"} themeMode={themeMode}>
            {activeTag === "All" && (
              <MaterialIcons
                name="check-circle"
                size={16}
                color="#FBFBFB"
                style={{ marginRight: 5 }}
              />
            )}
            <TagText active={activeTag === "All"} themeMode={themeMode}>
              All
            </TagText>
          </TagButton>
        </TagContainer>

        {/* "+ Add" Button */}
        {tags.length !== 0 && (
          <TagContainer onPress={onPress} key="add" activeOpacity={0.7}>
            <TagButton themeMode={themeMode}>
              <MaterialIcons
                name="add"
                size={16}
                color={themeMode === "dark" ? "#FBFBFB" : "#000"}
              />
            </TagButton>
          </TagContainer>
        )}

        {/* Mapped Tags */}
        {tags.map((tag) => (
          <TagContainer
            onPress={() => handlePress(tag)}
            key={tag.tagID}
            activeOpacity={0.7}
          >
            <TagButton active={isActive(tag)} themeMode={themeMode}>
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
          </TagContainer>
        ))}

        {/* Fallback when empty */}
        {tags.length === 0 && (
          <TagContainer onPress={onPress} key="empty" activeOpacity={0.7}>
            <TagButton themeMode={themeMode}>
              <MaterialIcons
                name="add"
                size={16}
                color={themeMode === "dark" ? "#FBFBFB" : "#000"}
                style={{ marginRight: 5 }}
              />
              <TagText themeMode={themeMode}>Add a tag</TagText>
            </TagButton>
          </TagContainer>
        )}
      </ScrollView>
    </View>
  );
};

export default TagList;
