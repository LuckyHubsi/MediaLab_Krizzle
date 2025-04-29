import { ColorSchemeProps } from "@/hooks/useColorScheme";
import styled from "styled-components/native";

export const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
`;

export const TagText = styled.Text<ColorSchemeProps>`
  font-family: Lexend;
  font-size: 16px;
  color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "#000" : "#fff"};
`;

export const IconRow = styled.View`
  flex-direction: row;
  align-items: center;
`;
