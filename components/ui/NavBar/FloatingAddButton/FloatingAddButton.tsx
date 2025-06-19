import React from "react";

import { GestureResponderEvent } from "react-native";
import { StyledButtonContainer } from "./FloatingAddButton.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";

/**
 * Component for a floating action button that triggers an action when pressed.
 *
 * @param onPress (required) - Callback function to handle press events.
 */

type FloatingAddButtonProps = {
  onPress: (event: GestureResponderEvent) => void;
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
      accessibilityLabel="Add new note, collection or folder"
      accessibilityHint="Opens a menu to create a new note, collection or folder"
    >
      <MaterialIcons name="add" size={40} color={Colors.white} />
    </StyledButtonContainer>
  );
};
