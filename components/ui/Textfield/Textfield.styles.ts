import { Colors } from "@/constants/Colors";
import { ColorSchemeProps } from "@/context/ThemeContext";
import styled from "styled-components/native";

export const TextfieldContainer = styled.View`
  width: 100%;
  gap: 8px;
`;

export const InputWrapper = styled.View<ColorSchemeProps>`
  flex-direction: row;
  align-items: center;
  border: 1px solid
    ${({ colorScheme }: ColorSchemeProps) =>
      colorScheme === "dark" ? Colors.grey50 : Colors.grey100};
  border-radius: 16px;
  padding: 0 20px;
`;
export const StyledTextInput = styled.TextInput<
  ColorSchemeProps & { multiline?: boolean }
>`
  font-size: 16px;
  font-family: "Lexend_300Light";
  flex: 1;
  color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "#000" : "#fff"};

  ${({ multiline }: { multiline?: boolean }) =>
    multiline
      ? `
    padding: 15px 20px;
  `
      : `
    padding: 0 20px;
    height: 50px; 
  `}
`;
