import React from "react";

import { GestureResponderEvent } from "react-native";
import { IconSymbol } from "../../IconSymbol";
import { StyledButtonContainer } from "./FloatingAddButton.styles";

type FloatingAddButtonProps = {
  onPress?: (event: GestureResponderEvent) => void;
};

export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({
  onPress,
}) => {
  return (
    <StyledButtonContainer onPress={onPress} activeOpacity={0.8}>
      <IconSymbol name="plus" size={36} color="#000" />
    </StyledButtonContainer>
  );
};
