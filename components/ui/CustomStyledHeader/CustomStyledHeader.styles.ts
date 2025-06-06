import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { ColorSchemeProps } from "@/context/ThemeContext";

export const StyledHeader = styled.View<{
  colorScheme: "light" | "dark";
  isTransparent?: boolean;
  borderRadiusTop?: number;
}>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px;
  border-radius: ${(props: { borderRadiusTop?: number }) =>
    `${props.borderRadiusTop ?? 0}px ${props.borderRadiusTop ?? 0}px 0px 0px`};
  background-color: ${({
    colorScheme,
    isTransparent,
  }: {
    colorScheme: "light" | "dark";
    isTransparent?: boolean;
  }) =>
    isTransparent
      ? "transparent"
      : colorScheme === "light"
        ? "#FBFBFB"
        : "#111111"};
`;

export const BackIcon = styled(Ionicons)<{
  colorScheme: "light" | "dark";
  isTransparent?: boolean;
}>`
  font-size: 24px;
  color: ${({
    colorScheme,
    isTransparent,
  }: {
    colorScheme: "light" | "dark";
    isTransparent?: boolean;
  }) =>
    isTransparent ? "white" : colorScheme === "light" ? "black" : "white"};
  margin-right: 15px;
  margin-top: 5px;
  margin-left: 5px;
`;

export const Icon = styled(Ionicons)<ColorSchemeProps>`
  font-size: 24px;
  color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "black" : "white"};
  margin: 6px;
`;
export const IconContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const TitleContainer = styled.View`
  max-width: 80%;
`;
