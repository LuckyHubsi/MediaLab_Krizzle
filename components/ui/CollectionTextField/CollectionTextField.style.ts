import { Colors } from "@/constants/Colors";
import { ColorSchemeProps } from "@/context/ThemeContext";
import styled from "styled-components/native";

export const TextfieldContainter = styled.View`
  width: 100%;
  gap: 8px;
`;

export const InputWrapper = styled.View<ColorSchemeProps>`
  flex-direction: row;
  align-items: left;
  border: 1px solid
    ${({ colorScheme }: ColorSchemeProps) =>
      colorScheme === "dark" ? Colors.grey50 : Colors.grey100};
  border-radius: 16px;
  padding: 0 0 0px;
`;
export const StyledTextInput = styled.TextInput<{
  colorScheme: "light" | "dark";
}>`
  padding: 15px 20px;
  font-size: 16px;
  font-family: "Lexend_300Light";
  flex: 1;
  color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "#000" : "#fff"};
  line-height: 20px;
  min-height: 48px;
  max-height: 200px;
`;
