import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";
import { View, Platform } from "react-native";
import { ColorSchemeProps } from "@/hooks/useColorScheme";

export const StyledCard = styled(View)<ColorSchemeProps>`
  width: 100%;
  height: auto;
  background-color: ${({ colorScheme }: ColorSchemeProps) =>
    Colors[colorScheme].cardBackground};
  border-radius: 33px;
  align-items: center;
  justify-content: center;
  padding: 20px;

  /* iOS Shadows */
  shadow-color: ${({ colorScheme }: ColorSchemeProps) =>
    Colors[colorScheme].cardShadowColor};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.05;
  shadow-radius: 20px;

  /* Android Shadow (Elevation) */
  ${Platform.select({
    android: `
      elevation: 8;
    `,
  })}
`;
