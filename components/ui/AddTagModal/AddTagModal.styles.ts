import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";
import { ColorSchemeProps } from "@/context/ThemeContext";

export const ModalBackground = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

export const ModalContainer = styled.View<ColorSchemeProps>`
  background-color: ${({ colorScheme }: ColorSchemeProps) =>
    Colors[colorScheme].cardBackground};
  padding: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

export const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const StyledInput = styled.TextInput<ColorSchemeProps>`
  flex: 1;
  padding: 12px 16px;
  font-size: 16px;
  font-family: Lexend;
  border: 1px solid #ccc;
  border-radius: 12px;
  margin-right: 10px;
  color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "#000" : "#fff"};
`;
