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
  width: 300px;
  background-color: ${({ colorScheme }: ThemeProps) =>
    colorScheme === "light" ? "#FBFBFB" : "#242424"};
  border-radius: 12px;
  padding: 20px;
  shadow-color: ${({ colorScheme }: ThemeProps) =>
    colorScheme === "light" ? "#000" : "#FFF"};
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 5;
  gap: 12px;
`;

export const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: 12px;
`;

export const Action = styled.Pressable`
  margin-left: 12px;
`;

export const ActionText = styled.Text<{ color?: string }>`
  font-family: Lexend_400Regular;
  color: ${({ color }: { color?: string }) => color || "#000"};
`;
