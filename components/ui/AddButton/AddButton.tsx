import React from "react";

import { GestureResponderEvent } from "react-native";
import { StyledButtonContainer } from "./AddButton.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type AddButtonProps = {
  onPress?: (event: GestureResponderEvent) => void;
  isDisabled?: boolean;
};

export const AddButton: React.FC<AddButtonProps> = ({
  onPress,
  isDisabled = false,
}) => {
  return (
    <StyledButtonContainer
      onPress={isDisabled ? undefined : onPress}
      isDisabled={isDisabled}
    >
      <MaterialIcons name="add" size={40} color="white" />
    </StyledButtonContainer>
  );
};
