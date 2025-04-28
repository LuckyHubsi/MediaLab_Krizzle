import { Colors } from "@/constants/Colors";
import { ColorSchemeProps } from "@/hooks/useColorScheme";
import { Color } from "@10play/tentap-editor";
import styled from "styled-components/native";

interface DateTextProps {
  placeholder: boolean | undefined;
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

export const DateText = styled.Text<DateTextProps & ColorSchemeProps>`
  padding: 15px 20px;
  font-size: 16px;
  font-family: "Lexend_300Light";
  flex: 1;
  color: ${({ placeholder, colorScheme }: DateTextProps & ColorSchemeProps) =>
    placeholder
      ? colorScheme === "light"
        ? "#585858"
        : "#ABABAB"
      : colorScheme === "light"
        ? Colors["light"].text
        : Colors.white};
`;
