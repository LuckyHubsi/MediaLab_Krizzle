import React, { FC, PropsWithChildren } from "react";
import { StyledButton } from "./Button.styles";
import { ThemedText } from "@/components/ThemedText";
import { useActiveColorScheme } from "@/context/ThemeContext";

/**
 * Component for a customizable button with text.
 * @param onPress - Callback function to handle button press.
 * @param isRed - Optional prop to change the button color to red.
 * @param children - The text to display inside the button.
 */

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
    <StyledButton onPress={onPress} isRed={isRed} colorScheme={colorScheme}>
      <ThemedText fontSize="regular" fontWeight="bold" colorVariant="white">
        {children}
      </ThemedText>
    </StyledButton>
  );
};
