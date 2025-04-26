import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import {
  Container,
  HeaderRow,
  ViewAllText,
  TagScrollView,
  TagPill,
  BackIcon,
} from "./TagPicker.styles";
import { useColorScheme } from "@/hooks/useColorScheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "react-native/Libraries/NewAppScreen";

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
        <ThemedText fontSize="regular" fontWeight="regular">
          Choose a Tag
        </ThemedText>
        <TouchableOpacity onPress={onViewAllPress}>
          <ThemedText fontSize="s" fontWeight="regular" colorVariant="viewAll">
            View all
            <BackIcon
              name="chevron-forward-outline"
              colorScheme={colorScheme}
            />
          </ThemedText>
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
                <ThemedText fontSize="s" fontWeight="regular">
                  {tag}
                </ThemedText>
              </TagPill>
            </TouchableOpacity>
          );
        })}
      </TagScrollView>
    </Container>
  );
};
