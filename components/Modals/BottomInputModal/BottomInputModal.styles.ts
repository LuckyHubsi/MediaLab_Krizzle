import { Colors } from "@/constants/Colors";
import { ColorSchemeProps } from "@/context/ThemeContext";
import styled from "styled-components/native";

export const ModalContent = styled.View<{ backgroundColor: string }>`
  width: 100%;
  max-width: 500px;
  background-color: ${({ colorScheme }: ColorSchemeProps) =>
    Colors[colorScheme].cardBackground};
  border-radius: 33px;
  padding: 10px 20px;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

export const StyledTextInput = styled.TextInput<{ textColor: string }>`
  flex: 1;
  border-color: #ccc;
  min-height: 50px;
  color: ${({ colorScheme }: ColorSchemeProps) => Colors[colorScheme].text};
  padding-vertical: 8px;
  font-size: 16px;
  font-family: Lexend_400Regular;
`;
