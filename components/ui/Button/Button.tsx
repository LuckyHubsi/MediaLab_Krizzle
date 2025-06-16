import React, { FC, PropsWithChildren } from "react";
import { StyledButton } from "./Button.styles";
import { ThemedText } from "@/components/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { useActiveColorScheme } from "@/context/ThemeContext";

export interface ButtonProps {
  onPress?: () => void;
  isRed?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  onPress,
  isRed = false,
  accessibilityLabel = "",
  accessibilityHint = "",
}) => {
  const colorScheme = useActiveColorScheme() ?? "light";
  return (
    <StyledButton
      onPress={onPress}
      isRed={isRed}
      colorScheme={colorScheme}
      accessible={true}
      accessibilityRole={"button"}
      accessibilityLabel={`${accessibilityLabel}`}
      accessibilityHint={`${accessibilityHint}`}
    >
      <ThemedText fontSize="regular" fontWeight="bold" colorVariant="white">
        {children}
      </ThemedText>
    </StyledButton>
  );
};
