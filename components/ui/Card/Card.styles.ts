import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";
import { View, Platform } from "react-native";
import { ColorSchemeProps } from "@/context/ThemeContext";

export const StyledCard = styled(View)<{
  colorScheme: "light" | "dark";
  width: string;
  height: string;
}>`
  width: ${({ width }: { width: string }) => width};
  height: ${({ height }: { height: string }) => height};
  background-color: ${({ colorScheme }: ColorSchemeProps) =>
    Colors[colorScheme].cardBackground};
  border-radius: 33px;
  border-color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "#EAEAEA" : "#242424"};
  border-width: 1px;
  overflow: hidden;
`;
