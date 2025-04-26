import React, { FC, PropsWithChildren } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TouchableOpacity, Text } from "react-native";
import { StyledButton } from "./Button.styles";
import { ThemedText } from "@/components/ThemedText";

interface ButtonProps {
  size?: "small" | "medium" | "large";
  onPress?: () => void;
  color?: string;
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  size = "medium",
  onPress,
  color,
}) => {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <StyledButton onPress={onPress} colorScheme={colorScheme}>
      <ThemedText fontSize="regular" fontWeight="bold" colorVariant="white">
        {children}
      </ThemedText>
    </StyledButton>
  );
};
