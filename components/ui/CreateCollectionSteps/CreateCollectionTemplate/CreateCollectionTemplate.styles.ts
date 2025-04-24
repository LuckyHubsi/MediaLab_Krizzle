import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

type ThemeProps = {
  colorScheme: "light" | "dark";
};

export const ItemCountContainer = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

export const ItemCount = styled.View`
  width: 50%;
  flex-direction: row;
  border-radius: 33px;
  border: 1px solid
    ${({ colorScheme }: ThemeProps) => Colors[colorScheme].placeholder};
  padding: 10px 15px;
`;
