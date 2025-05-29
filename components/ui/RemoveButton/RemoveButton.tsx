import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { GestureResponderEvent } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { StyledButtonContainer } from "./RemoveButton.styles";
import { Colors } from "@/constants/Colors";
import { useActiveColorScheme } from "@/context/ThemeContext";

type RemoveButtonProps = {
  onPress?: (event: GestureResponderEvent) => void;
};

const RemoveButton: React.FC<RemoveButtonProps> = ({ onPress }) => {
  const colorScheme = useActiveColorScheme();

  return (
    <StyledButtonContainer onPress={onPress} colorScheme={colorScheme}>
      <MaterialIcons
        name="delete"
        size={24}
        color={Colors[colorScheme].negative}
      />
      <ThemedText colorVariant="red">Remove</ThemedText>
    </StyledButtonContainer>
  );
};

export default RemoveButton;
