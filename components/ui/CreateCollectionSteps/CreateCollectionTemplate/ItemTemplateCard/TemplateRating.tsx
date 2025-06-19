import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity } from "react-native";
import {
  IconContainer,
  RatingIconsContainer,
} from "../CreateCollectionTemplate.styles";
import { useActiveColorScheme } from "@/context/ThemeContext";

/**
 * Component for displaying a rating selection using Material Icons.
 * It allows users to select a rating from a predefined set of icons.
 * @param title (required) - The title of the rating section.
 * @param rating (required) - The currently selected rating icon.
 * @param onRatingChange (required) - Callback function to handle changes in the selected rating icon.
 */

// Array of icon names from MaterialIcons to be used in the rating component
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
            <TouchableOpacity
              key={icon}
              onPress={() => onRatingChange(icon)}
              accessibilityRole="radio"
              accessibilityLabel={`${icon}`}
              accessibilityState={{ selected: rating === icon }}
            >
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
