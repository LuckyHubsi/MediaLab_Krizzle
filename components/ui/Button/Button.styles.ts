// Button.styles.ts
import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

interface ButtonProps {
  isRed?: boolean;
  colorScheme: "light" | "dark";
}

export const StyledButton = styled.TouchableOpacity<ButtonProps>`
  align-items: center;
  justify-content: center;
  border-radius: 33px;
  text-align: center;
  width: 100%;
  padding-vertical: 18px;
  margin-bottom: 10px;
  background-color: ${({ isRed, colorScheme }: ButtonProps) =>
    isRed ? Colors[colorScheme].negative : Colors.tintColor};
`;
