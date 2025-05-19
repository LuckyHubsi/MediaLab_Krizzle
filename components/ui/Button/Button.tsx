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
    <LinearGradient
      colors={[
        Colors[colorScheme].background + "00",
        Colors[colorScheme].background + "B0",
        Colors[colorScheme].background + "FF",
      ]}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: 35,
      }}
    >
      <StyledButton onPress={onPress} isRed={isRed}>
        <ThemedText fontSize="regular" fontWeight="bold" colorVariant="white">
          {children}
        </ThemedText>
      </StyledButton>
    </LinearGradient>
  );
};
