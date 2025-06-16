import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";

interface CollectionItemContainerProps {
  themeMode?: "light" | "dark";
}

export const ItemContainer = styled.View`
  gap: 6px;
`;
export const AltTextContainer = styled.View`
  position: absolute;
  bottom: 8;
  left: 8;
  right: 8;
  background-color: ${({ themeMode }: CollectionItemContainerProps) =>
    themeMode === "light" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"};
  border-radius: 10px;
  padding: 8px 8px;
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
