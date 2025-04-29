import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { TagButton, TagText } from "./TagList.styles";
import { useActiveColorScheme } from "@/context/ThemeContext";

type TagListProps = {
  tags: string[];
  onSelect?: (selected: string) => void;
};

const TagList: React.FC<TagListProps> = ({ tags, onSelect }) => {
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
            <TagText active={tag === activeTag} themeMode={themeMode}>
              {tag}
            </TagText>
          </TagButton>
        ))}
      </ScrollView>
    </View>
  );
};

export default TagList;
