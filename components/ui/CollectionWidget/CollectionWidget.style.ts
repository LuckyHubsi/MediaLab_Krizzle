import { ColorSchemeProps } from "@/context/ThemeContext";
import styled from "styled-components/native";

export const CollectionCardContainer = styled.View<ColorSchemeProps>`
  border-radius: 25px;
  border-width: 1px;
  border-color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "#EAEAEA" : "#242424"};
  background-color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "#FBFBFB" : "#242424"};
  width: 100%;
  padding: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
`;

export const CollectionText = styled.Text<ColorSchemeProps>`
  width: 100%;
  height: 48px; /* Set a fixed height */
  max-height: 48px; /* Limit the height to 48px */
  color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "#585858" : "#ABABAB"};
  font-family: Lexend_400Regular;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 171.429% */
  letter-spacing: -0.35px;
  overflow: hidden; /* Hide any overflowing text */
`;
export const CollectionDate = styled.Text<ColorSchemeProps>`
  color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "#585858" : "#ABABAB"};
`;

export const CollectionRating = styled.Text<ColorSchemeProps>`
  color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "#585858" : "#ABABAB"};
  font-family: Lexend_400Regular;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 171.429% */
  letter-spacing: -0.35px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const CollectionSelectable = styled.Text<ColorSchemeProps>`
  border-radius: 33px;
  border: 1px solid
    ${({ colorScheme }: ColorSchemeProps) =>
      colorScheme === "light" ? "#585858" : "#EAEAEA"};
  background: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "#EAEAEA" : "#242424"};
  display: flex;
  padding: 4px 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-right: 5px;
  margin-top: 5px;
  color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "#585858" : "#EAEAEA"};
`;
