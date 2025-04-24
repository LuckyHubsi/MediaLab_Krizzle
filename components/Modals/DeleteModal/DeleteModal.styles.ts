import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

// Shared type for components that need light/dark mode styling
type ThemeProps = {
  colorScheme: "light" | "dark";
};

export const Overlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  font-family: Lexend_400Regular;
`;

export const ModalBox = styled.View<ThemeProps>`
  background-color: ${({ colorScheme }: ThemeProps) =>
    Colors[colorScheme].cardBackground};
  padding: 15px 15px 2px;
  border-radius: 12px;
  gap: 4px;
  width: 80%;
  align-items: center;
  text-align: center;
`;

export const ButtonRow = styled.View`
  margin-top: 15px;
  width: 100%;
`;

export const Action = styled.Pressable<ThemeProps>`
  padding: 16px;
  align-items: center;
  width: 100%;
  border-top-width: 1px;
  border-color: ${({ colorScheme }: ThemeProps) =>
    Colors[colorScheme].pillBackground};
`;

export const ActionText = styled.Text<{ color?: string }>`
  font-family: Lexend_400Regular;
  font-size: 16px;
  font-weight: 600;
  color: ${({ color }: { color?: string }) => color || "#000"};
`;
