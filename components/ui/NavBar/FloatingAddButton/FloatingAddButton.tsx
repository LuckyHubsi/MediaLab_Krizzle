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
    <StyledButtonContainer onPress={onPress} colorScheme={color}>
      <MaterialIcons name="add" size={40} color={"white"} />
    </StyledButtonContainer>
  );
};
