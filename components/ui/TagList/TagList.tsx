import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { TagButton, TagText } from "./TagList.styles";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";

type TagListProps = {
  tags: string[];
  onSelect?: (selected: string) => void;
  onPress?: () => void;
};

const TagList: React.FC<TagListProps> = ({ tags, onSelect, onPress }) => {
  const [activeTag, setActiveTag] = useState(tags[0]);
  const themeMode = useActiveColorScheme() ?? "light";

  const handlePress = (tag: string) => {
    setActiveTag(tag);
    onSelect?.(tag);
  };

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tags.map((tag) => (
          <TagButton
            key={tag}
            active={tag === activeTag}
            themeMode={themeMode}
            onPress={() => handlePress(tag)}
          >
            {tag === activeTag && (
              <MaterialIcons
                name="check-circle"
                size={16}
                color="#FBFBFB"
                style={{ marginRight: 5 }}
              />
            )}
            <TagText active={tag === activeTag} themeMode={themeMode}>
              {tag}
            </TagText>
          </TagButton>
        ))}
        {tags.length === 1 && (
          <TagButton themeMode={themeMode} onPress={onPress}>
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
