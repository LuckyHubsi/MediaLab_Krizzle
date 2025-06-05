import React, { useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { MaterialIcons } from "@expo/vector-icons";
import {
  RatingPickerContainer,
  RatingPickerWrapper,
} from "./RatingPicker.styles";
import { Colors } from "@/constants/Colors";

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
      <ThemedText>{title}</ThemedText>
      <RatingPickerWrapper>
        {[0, 1, 2, 3, 4].map((i) => (
          <MaterialIcons
            key={i}
            name={selectedIcon}
            size={32}
            color={i < rating ? Colors.primary : Colors.grey100}
            onPress={editable ? () => handlePress(i) : undefined}
          />
        ))}
      </RatingPickerWrapper>
    </RatingPickerContainer>
  );
};

export default RatingPicker;
