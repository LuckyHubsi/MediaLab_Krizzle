import { Colors } from "react-native/Libraries/NewAppScreen";
import styled from "styled-components/native";

interface DateTextProps {
  placeholder: boolean | undefined;
  colorScheme: "light" | "dark";
}

export const DateFieldContainer = styled.View`
  width: 100%;
  gap: 8px;
`;

export const StyledPressable = styled.Pressable`
  width: 100%;
`;

export const DateInputContainer = styled.View<{
  colorScheme: "light" | "dark";
}>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    Colors[colorScheme].background};
  border: 1px solid
    ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
      colorScheme === "dark" ? Colors.white : Colors.grey100};
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
        ? "#585858"
        : "#ABABAB"
      : colorScheme === "light"
        ? Colors["light"].text
        : Colors.white};
`;
