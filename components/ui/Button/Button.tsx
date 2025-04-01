import React, { FC, PropsWithChildren } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TouchableOpacity, Text } from "react-native";
import { ButtonText, StyledButton } from "./Button.styles";

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
      <ButtonText colorScheme={colorScheme}>{children}</ButtonText>
    </StyledButton>
  );
};
