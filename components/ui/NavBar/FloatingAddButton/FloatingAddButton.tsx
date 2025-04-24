import React from "react";

import { GestureResponderEvent, useColorScheme } from "react-native";
import { StyledButtonContainer } from "./FloatingAddButton.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type FloatingAddButtonProps = {
  onPress?: (event: GestureResponderEvent) => void;
};

export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({
  onPress,
}) => {
  const color = useColorScheme() === "dark" ? "black" : "white";

  return (
    <StyledButtonContainer onPress={onPress}>
      <MaterialIcons name="add" size={40} color={color} />
    </StyledButtonContainer>
  );
};
