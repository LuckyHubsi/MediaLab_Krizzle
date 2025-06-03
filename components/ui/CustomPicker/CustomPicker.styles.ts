import { Colors } from "@/constants/Colors";
import { ColorSchemeProps } from "@/context/ThemeContext";
import styled from "styled-components/native";

export const AndroidPickerTouchable = styled.TouchableOpacity<{
  colorScheme: "light" | "dark";
}>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-radius: 16px;
`;

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: flex-end;
`;

export const ModalContent = styled.View<ColorSchemeProps>`
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  background-color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "dark" ? "#1c1c1e" : "#fff"};
`;

export const OptionButton = styled.TouchableOpacity`
  padding-vertical: 12px;
`;
