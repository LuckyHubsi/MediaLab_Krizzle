import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";
import { ColorSchemeProps } from "@/context/ThemeContext";

export const ItemContainer = styled.View`
  gap: 6px;
`;

export const ImageContainer = styled.View`
  height: 400px;
  border-radius: 16px;
  backgroundcolor: ${Colors.grey25};
  margin-top: 8px;
  overflow: hidden;
  gap: 8px;
`;

export const ImageOverlay = styled.View<ColorSchemeProps>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? Colors.grey25 : Colors.dark.pillBackground};
`;

export const AltTextContainer = styled.View<ColorSchemeProps>`
  position: absolute;
  bottom: 8;
  left: 8;
  right: 8;
  background-color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light"
      ? "rgba(255, 255, 255, 0.7)"
      : "rgba(0, 0, 0, 0.7)"};
  border-radius: 10px;
  padding: 8px 8px;
`;

export const SelectableContainer = styled.View<ColorSchemeProps>`
  background-color: transparent;
  border: 1px solid
    ${({ colorScheme }: ColorSchemeProps) =>
      colorScheme === "light" ? Colors.grey25 : Colors.grey100};
  border-radius: 33px;
  display: flex;
  padding: 4px 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
