import React from "react";

import { GestureResponderEvent } from "react-native";
import { StyledButtonContainer } from "./FloatingAddButton.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useActiveColorScheme } from "@/context/ThemeContext";

type FloatingAddButtonProps = {
  onPress?: (event: GestureResponderEvent) => void;
};

export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({
  onPress,
}) => {
  const color = useActiveColorScheme();

  return (
    <StyledButtonContainer
      onPress={onPress}
      colorScheme={color}
      accessibilityRole="button"
      accessibilityLabel="Add new item"
      accessibilityHint="Opens a modal to create a new item"
    >
      <MaterialIcons name="add" size={40} color={"white"} />
    </StyledButtonContainer>
  );
};
