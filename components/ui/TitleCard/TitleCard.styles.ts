import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";
import { ColorSchemeProps } from "@/context/ThemeContext";

export const Container = styled.View`
  width: 100%;
  gap: 8px;
`;

export const Label = styled.Text<ColorSchemeProps>`
  font-family: Lexend;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.4px;
  color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "#000" : "#fff"};
  margin-bottom: 6px;
`;

export const InputWrapper = styled.View<ColorSchemeProps>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ colorScheme }: ColorSchemeProps) =>
    Colors[colorScheme].cardBackground};
  border: 1px solid
    ${({ colorScheme }: ColorSchemeProps) =>
      colorScheme === "light" ? "#ccc" : "#555"};
  border-radius: 20px;
  padding: 12px 16px;

  /* Shadows */
  shadow-color: ${({ colorScheme }: ColorSchemeProps) =>
    Colors[colorScheme].cardShadowColor};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.05;
  shadow-radius: 20px;
  elevation: 6;
`;

export const TextIcon = styled.View`
  margin-right: 12px;
`;

export const StyledTitleInput = styled.TextInput<ColorSchemeProps>`
  flex: 1;
  font-size: 16px;
  font-family: Lexend;
  color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "#000" : "#fff"};
`;

export const TextAlignRight = styled.View`
  width: 100%;
  align-items: flex-end;
  position: absolute;
`;
