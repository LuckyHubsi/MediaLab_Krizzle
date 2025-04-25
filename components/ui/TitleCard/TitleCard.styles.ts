import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";

export const Container = styled.View`
  width: 100%;
  gap: 8px;
`;

export const Label = styled.Text<{ colorScheme: "light" | "dark" }>`
  font-family: Lexend;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.4px;
  color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? "#000" : "#fff"};
  margin-bottom: 6px;
`;

export const InputWrapper = styled.View<{ colorScheme: "light" | "dark" }>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    Colors[colorScheme].cardBackground};
  border: 1px solid
    ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
      colorScheme === "light" ? "#ccc" : "#555"};
  border-radius: 20px;
  padding: 12px 16px;

  /* Shadows */
  shadow-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    Colors[colorScheme].cardShadowColor};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.05;
  shadow-radius: 20px;
  elevation: 6;
`;

export const TextIcon = styled.View`
  margin-right: 12px;
`;

export const StyledTitleInput = styled.TextInput<{
  colorScheme: "light" | "dark";
}>`
  flex: 1;
  font-size: 16px;
  font-family: Lexend;
  color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? "#000" : "#fff"};
`;

export const TextAlignRight = styled.View`
  width: 100%;
  align-items: flex-end;
  position: absolute;
`;
