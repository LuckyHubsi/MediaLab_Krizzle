import React from "react";

import { GestureResponderEvent } from "react-native";
import { StyledButtonContainer } from "./AddButton.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type AddButtonProps = {
  onPress?: (event: GestureResponderEvent) => void;
};

export const AddButton: React.FC<AddButtonProps> = ({ onPress }) => {
  return (
    <StyledButtonContainer onPress={onPress}>
      <MaterialIcons name="add" size={40} color="white" />
    </StyledButtonContainer>
  );
};
