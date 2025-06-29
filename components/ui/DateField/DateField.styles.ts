import { Colors } from "@/constants/Colors";
import { ColorSchemeProps } from "@/context/ThemeContext";
import styled from "styled-components/native";

interface DateTextProps {
  placeholder: boolean | undefined;
  colorScheme: ColorSchemeProps["colorScheme"];
}

export const DateFieldContainer = styled.View`
  width: 100%;
  gap: 8px;
`;

export const StyledPressable = styled.Pressable`
  width: 100%;
`;

export const DateInputContainer = styled.View<ColorSchemeProps>`
  flex-direction: row;
  align-items: center;
  border: 1px solid
    ${({ colorScheme }: ColorSchemeProps) =>
      colorScheme === "dark" ? Colors.grey50 : Colors.grey100};
  border-radius: 16px;
  padding: 0 20px;
`;

export const DateText = styled.Text<DateTextProps>`
  padding: 15px 20px;
  font-size: 16px;
  font-family: "Lexend_300Light";
  flex: 1;
  color: ${({ placeholder, colorScheme }: DateTextProps) =>
    placeholder
      ? colorScheme === "light"
        ? Colors.grey100
        : Colors.grey50
      : Colors[colorScheme].text};
`;

export const StyledClearButton = styled.Pressable`
  padding: 8px;
  margin-left: 8px;
  justify-content: center;
  align-items: center;
`;
