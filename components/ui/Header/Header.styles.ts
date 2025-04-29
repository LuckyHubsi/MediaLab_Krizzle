import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { ColorSchemeProps } from "@/hooks/useColorScheme";

export const StyledHeader = styled.View<ColorSchemeProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 0 17px 0;
  background-color: ${({ colorScheme }: ColorSchemeProps) =>
    Colors[colorScheme].cardBackground};
`;

export const BackIcon = styled(Ionicons)<ColorSchemeProps>`
  font-size: 24px;
  color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "black" : "white"};
  margin-right: 15px;
  margin-top: 5px;
  margin-left: 5px;
`;
