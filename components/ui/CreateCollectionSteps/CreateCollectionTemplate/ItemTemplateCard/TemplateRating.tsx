import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import {
  IconContainer,
  RatingIconsContainer,
} from "../CreateCollectionTemplate.styles";

const iconArray: (keyof typeof MaterialIcons.glyphMap)[] = [
  "star",
  "coffee",
  "fastfood",
  "local-grocery-store",
  "airplanemode-active",
  "videogame-asset",
  "auto-stories",
  "bakery-dining",
  "cake",
  "directions-car-filled",
  "emoji-events",
  "extension",
  "favorite",
  "flatware",
  "liquor",
  "chat",
  "groups",
  "celebration",
  "sports-bar",
  "diversity-1",
  "psychology",
  "directions-run",
  "sports-esports",
  "medical-services",
];

interface TemplateRatingProps {
  title: string;
}

const TemplateRating: React.FC<TemplateRatingProps> = ({ title }) => {
  const [selectedIcons, setSelectedIcons] = useState<Set<string>>(new Set());

  const toggleIconSelection = (icon: string) => {
    setSelectedIcons(() => {
      const updated = new Set<string>();
      updated.add(icon);
      return updated;
    });
  };

  return (
    <RatingIconsContainer>
      <ThemedText>{title}</ThemedText>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <IconContainer>
          {iconArray.map((icon) => (
            <TouchableOpacity
              key={icon}
              onPress={() => toggleIconSelection(icon)}
            >
              <MaterialIcons
                name={icon}
                size={28}
                color={
                  selectedIcons.has(icon) ? Colors.primary : Colors.grey100
                }
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          ))}
        </IconContainer>
      </ScrollView>
    </RatingIconsContainer>
  );
};

export default TemplateRating;
