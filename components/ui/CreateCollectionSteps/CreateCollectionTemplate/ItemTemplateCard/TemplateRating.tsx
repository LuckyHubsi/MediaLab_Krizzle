import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity } from "react-native";
import {
  IconContainer,
  RatingIconsContainer,
} from "../CreateCollectionTemplate.styles";
import { useActiveColorScheme } from "@/context/ThemeContext";

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
  rating: keyof typeof MaterialIcons.glyphMap;
  onRatingChange: (newRating: keyof typeof MaterialIcons.glyphMap) => void;
}

const TemplateRating: React.FC<TemplateRatingProps> = ({
  title,
  rating,
  onRatingChange,
}) => {
  const colorScheme = useActiveColorScheme() ?? "light";
  return (
    <RatingIconsContainer>
      <ThemedText>{title}</ThemedText>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <IconContainer>
          {iconArray.map((icon) => (
            <TouchableOpacity key={icon} onPress={() => onRatingChange(icon)}>
              <MaterialIcons
                name={icon}
                size={28}
                color={
                  rating === icon
                    ? colorScheme === "light"
                      ? Colors.primary
                      : Colors.secondary
                    : colorScheme === "light"
                      ? Colors.grey100
                      : Colors.grey50
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
