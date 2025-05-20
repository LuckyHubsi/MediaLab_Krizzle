import React, { FC, PropsWithChildren } from "react";
import { StyledButton } from "./Button.styles";
import { ThemedText } from "@/components/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { useActiveColorScheme } from "@/context/ThemeContext";

export interface ButtonProps {
  onPress?: () => void;
  isRed?: boolean;
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  onPress,
  isRed = false,
}) => {
  const colorScheme = useActiveColorScheme() ?? "light";
  return (
    <StyledButton onPress={onPress} isRed={isRed}>
      <ThemedText fontSize="regular" fontWeight="bold" colorVariant="white">
        {children}
      </ThemedText>
    </StyledButton>
  );
};
