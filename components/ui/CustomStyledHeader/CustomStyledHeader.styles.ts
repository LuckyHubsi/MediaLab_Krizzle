import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { ColorSchemeProps } from "@/hooks/useColorScheme";

export const StyledHeader = styled.View<ColorSchemeProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px;
  background-color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "#FBFBFB" : "#111111"};
`;

export const BackIcon = styled(Ionicons)<ColorSchemeProps>`
  font-size: 24px;
  color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "black" : "white"};
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
