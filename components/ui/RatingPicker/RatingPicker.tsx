import React, { useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { MaterialIcons } from "@expo/vector-icons";
import {
  RatingPickerContainer,
  RatingPickerWrapper,
} from "./RatingPicker.styles";
import { Colors } from "@/constants/Colors";

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

  useEffect(() => {
    setRating(value);
  }, [value]);

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
