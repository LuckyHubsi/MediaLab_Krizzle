import React, { FC, PropsWithChildren } from "react";
import { StyledButton } from "./Button.styles";
import { ThemedText } from "@/components/ThemedText";
import { useActiveColorScheme } from "@/context/ThemeContext";

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
  const colorScheme = useActiveColorScheme() ?? "light";

  return (
    <StyledButton onPress={onPress} colorScheme={colorScheme}>
      <ThemedText fontSize="regular" fontWeight="bold" colorVariant="white">
        {children}
      </ThemedText>
    </StyledButton>
  );
};
