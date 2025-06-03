import { Colors } from "@/constants/Colors";
import { ColorSchemeProps } from "@/context/ThemeContext";
import styled from "styled-components/native";

export const StyledCardWrapper = styled.View<ColorSchemeProps>`
  margin-top: 10px;
  width: 100%;
  background-color: ${({ colorScheme }: ColorSchemeProps) =>
    Colors[colorScheme].cardBackground};
  padding: 25px 20px;
  gap: 30px;
  border-radius: 25px;
`;
