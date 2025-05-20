import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";
import { Platform } from "react-native";
import { ColorSchemeProps } from "@/context/ThemeContext";

export const StyledChooseCard = styled.View<ColorSchemeProps>`
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
  background-color: ${({ colorScheme }: ColorSchemeProps) =>
    Colors[colorScheme].cardBackground};
  border-width: 1px;
  border-color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "#EAEAEA" : "#242424"};
  border-radius: 33px;
  position: relative;
`;

export const EditButton = styled.View`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px;
`;

export const Circle = styled.View`
  width: 38px;
  height: 38px;
  border-radius: 40px;
  border-width: 1px;
  border-color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? Colors.grey50 : Colors.grey100};
  align-items: center;
  justify-content: center;
`;
