import React from "react";

import { GestureResponderEvent } from "react-native";
import { StyledButtonContainer } from "./AddButton.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";

/**
 * Component for an add (plus) button.
 *
 * @param onPress - Callback function to handle button press events.
 * @param isDisabled - Optional prop to disable the button.
 */

type AddButtonProps = {
  onPress?: (event: GestureResponderEvent) => void;
  isDisabled?: boolean;
  label?: string;
};

export const AddButton: React.FC<AddButtonProps> = ({
  onPress,
  isDisabled = false,
  label = "",
}) => {
  return (
    <StyledButtonContainer
      onPress={isDisabled ? undefined : onPress}
      isDisabled={isDisabled}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <MaterialIcons name="add" size={40} color={Colors.white} />
    </StyledButtonContainer>
  );
};
