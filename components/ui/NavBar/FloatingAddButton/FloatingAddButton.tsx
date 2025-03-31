import React from "react";

import { GestureResponderEvent, useColorScheme } from "react-native";
import { Icon } from "../../IconSymbol";
import { StyledButtonContainer } from "./FloatingAddButton.styles";

type FloatingAddButtonProps = {
  onPress?: (event: GestureResponderEvent) => void;
};

export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({
  onPress,
}) => {
  const color = useColorScheme() === "dark" ? "black" : "white";

  return (
    <StyledButtonContainer onPress={onPress} activeOpacity={0.8}>
      <Icon name="add" size={40} color={color} />
    </StyledButtonContainer>
  );
};
