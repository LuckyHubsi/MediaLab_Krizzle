import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";
import { View, Platform } from "react-native";

export const StyledCard = styled(View)<{
  colorScheme: "light" | "dark";
  width: string;
  height: string;
}>`
  width: ${({ width }: { width: string }) => width};
  height: ${({ height }: { height: string }) => height};
  background-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    Colors[colorScheme].cardBackground};
  border-radius: 33px;
  align-items: center;
  justify-content: center;
  padding: 20px;

  /* iOS Shadows */
  shadow-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
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
