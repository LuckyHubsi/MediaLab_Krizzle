import { Colors } from "@/constants/Colors";
import { ColorSchemeProps } from "@/context/ThemeContext";
import styled from "styled-components/native";

export const CollectionCardContainer = styled.View<ColorSchemeProps>`
  border-radius: 25px;
  border-width: 1px;
  border-color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? Colors.grey25 : Colors.grey200};
  background-color: ${({ colorScheme }: ColorSchemeProps) =>
    Colors[colorScheme].background};
  width: 100%;
  padding: 20px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
`;

export const CollectionText = styled.Text<ColorSchemeProps>`
  margin-top: 6px;

  color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? Colors.grey100 : Colors.grey50};
  font-family: Lexend_400Regular;
  font-size: 14px;
  font-style: normal;
  font-weight: 300;
  line-height: 16.8px;
  letter-spacing: -0.35px;
  overflow: hidden;
`;
export const CollectionDate = styled.Text<ColorSchemeProps>`
  color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? Colors.grey100 : Colors.grey50};
`;

export const CollectionRating = styled.Text<ColorSchemeProps>`
  color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? Colors.grey100 : Colors.grey50};
  font-family: Lexend_400Regular;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.35px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const CollectionSelectable = styled.Text<ColorSchemeProps>`
  border-radius: 33px;
  border: 1px solid
    ${({ colorScheme }: ColorSchemeProps) =>
      colorScheme === "light" ? Colors.grey100 : Colors.grey25};
  display: flex;
  padding: 4px 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-right: 5px;
  margin-top: 5px;
  color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? Colors.grey100 : Colors.grey25};
`;
