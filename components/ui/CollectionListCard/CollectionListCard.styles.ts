import { Colors } from "@/constants/Colors";
import { ColorSchemeProps } from "@/context/ThemeContext";
import styled from "styled-components/native";

export const BackgroundCard = styled.View<{
  colorScheme: ColorSchemeProps;
  topOffset?: number;
}>`
  position: absolute;
  top: 30px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ colorScheme }: ColorSchemeProps) =>
    Colors[colorScheme].background};
  border-top-left-radius: 33px;
  border-top-right-radius: 33px;
  margin-top: 9px;
`;
