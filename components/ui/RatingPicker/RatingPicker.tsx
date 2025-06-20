import React, { useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { MaterialIcons } from "@expo/vector-icons";
import {
  RatingPickerContainer,
  RatingPickerWrapper,
} from "./RatingPicker.styles";
import { Colors } from "@/constants/Colors";
import { useActiveColorScheme } from "@/context/ThemeContext";

/**
 * Component for selecting a rating using icons.
 *
 * @param title - The title of the rating picker.
 * @param selectedIcon - The icon to use for the selected rating (default is "star").
 * @param editable - Whether the rating can be changed by the user (default is true).
 * @param value - The current rating value (default is 0).
 * @param onChange - Callback function to handle rating changes.
 */

interface RatingPickerProps {
  title?: string;
  selectedIcon?: keyof typeof MaterialIcons.glyphMap;
  editable?: boolean;
  value?: number;
  onChange?: (rating: number) => void;
}

const RatingPicker: React.FC<RatingPickerProps> = ({
  title,
  selectedIcon = "star",
  editable = true,
  value = 0,
  onChange,
}) => {
  const [rating, setRating] = useState(value);
  const colorScheme = useActiveColorScheme() ?? "light";
  /**
   * Effect to initialize the rating state with the provided value.
   */
  useEffect(() => {
    setRating(value);
  }, [value]);

  /**
   * Handles the press event on a rating icon.
   * Toggles the rating between the pressed index and 0 if already selected.
   *
   * @param index - The index of the pressed icon.
   */
  const handlePress = (index: number) => {
    const newRating = index + 1;
    const updatedRating = newRating === rating ? 0 : newRating;
    setRating(updatedRating);
    if (onChange) {
      onChange(updatedRating);
    }
  };

  return (
    <RatingPickerContainer>
      <ThemedText accessibilityLabel={`Label ${title}`} nativeID={title}>
        {title}
      </ThemedText>
      <RatingPickerWrapper>
        {[0, 1, 2, 3, 4].map((i) => (
          <MaterialIcons
            key={i}
            name={selectedIcon}
            size={32}
            color={
              i < rating
                ? colorScheme === "light"
                  ? Colors.primary
                  : Colors.secondary
                : colorScheme === "light"
                  ? Colors.grey100
                  : Colors.grey50
            }
            onPress={editable ? () => handlePress(i) : undefined}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Rating Button ${i + 1} of 5`}
            accessibilityHint={
              i + 1 === rating
                ? `Reselect to reset your rating to 0 out of 5 ${selectedIcon}`
                : `Select to set your rating to ${i + 1}  out of 5 ${selectedIcon} icons`
            }
            accessibilityState={{ selected: i + 1 === rating }}
            accessibilityLabelledBy={title}
          />
        ))}
      </RatingPickerWrapper>
    </RatingPickerContainer>
  );
};

export default RatingPicker;
