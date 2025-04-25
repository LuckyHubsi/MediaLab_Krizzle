import React, { useState } from "react";
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
  outlinedIcon?: keyof typeof MaterialIcons.glyphMap;
  editable?: boolean;
}

const RatingPicker: React.FC<RatingPickerProps> = ({
  title,
  selectedIcon,
  outlinedIcon = "star-border",
  editable = true,
}) => {
  const [rating, setRating] = useState(0);

  const handlePress = (index: number) => {
    setRating(index + 1);
  };

  return (
    <RatingPickerContainer>
      <ThemedText>{title}</ThemedText>
      <RatingPickerWrapper>
        {[0, 1, 2, 3, 4].map((i) => (
          <MaterialIcons
            key={i}
            name={i < rating ? selectedIcon : outlinedIcon}
            size={32}
            color={Colors.primary}
            onPress={editable ? () => handlePress(i) : undefined}
          />
        ))}
      </RatingPickerWrapper>
    </RatingPickerContainer>
  );
};

export default RatingPicker;
