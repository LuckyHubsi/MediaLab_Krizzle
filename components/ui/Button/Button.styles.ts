// Button.styles.ts
import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";

export const StyledButton = styled.TouchableOpacity<{
  colorScheme: "light" | "dark";
}>`
  align-items: center;
  justify-content: center;
  border-radius: 33px;
  text-align: center;
  width: 100%;
  padding-vertical: 18px;
  background-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    Colors[colorScheme].tint};
  font-family: "Lexend_400Regular";
`;
