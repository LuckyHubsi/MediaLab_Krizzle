import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";

interface CollectionItemContainerProps {
  themeMode?: "light" | "dark";
}

export const ItemContainer = styled.View`
  gap: 0px;
`;
export const SelectableContainer = styled.View<CollectionItemContainerProps>`
  background-color: transparent;
  border: 1px solid
    ${({ themeMode }: CollectionItemContainerProps) =>
      themeMode === "light" ? Colors.grey25 : Colors.grey100};
  border-radius: 33px;
  display: flex;
  padding: 4px 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

export const ContentText = styled.Text`
  color: #585858;

  font-family: Lexend;
  font-size: 14px;
  font-style: normal;
  font-weight: 800;
  line-height: 24px; /* 171.429% */
  letter-spacing: -0.35px;
`;
