import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { GestureResponderEvent } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { StyledButtonContainer } from "./RemoveButton.styles";
import { Colors } from "@/constants/Colors";

type RemoveButtonProps = {
  onPress?: (event: GestureResponderEvent) => void;
};

const RemoveButton: React.FC<RemoveButtonProps> = ({ onPress }) => {
  return (
    <StyledButtonContainer onPress={onPress}>
      <MaterialIcons name="delete" size={24} color={Colors.negative} />
      <ThemedText colorVariant="red">Remove</ThemedText>
    </StyledButtonContainer>
  );
};

export default RemoveButton;
