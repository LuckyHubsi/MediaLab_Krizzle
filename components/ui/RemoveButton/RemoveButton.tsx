import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { GestureResponderEvent } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { StyledButtonContainer } from "./RemoveButton.styles";
import { Colors } from "@/constants/Colors";
import { useActiveColorScheme } from "@/context/ThemeContext";

/**
 * Component for a button that allows users to remove an item or perform a type of deletion action.
 *
 * @param onPress - Callback function to handle press events.
 */

type RemoveButtonProps = {
  onPress?: (event: GestureResponderEvent) => void;
  label?: string;
};

const RemoveButton: React.FC<RemoveButtonProps> = ({ onPress, label = "" }) => {
  const colorScheme = useActiveColorScheme();

  return (
    <StyledButtonContainer
      onPress={onPress}
      colorScheme={colorScheme}
      accessibilityRole="button"
      accessibilityLabel={`Remove ${label}`}
    >
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
