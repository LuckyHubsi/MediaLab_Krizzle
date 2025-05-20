import { ColorSchemeProps } from "@/context/ThemeContext";
import styled from "styled-components/native";

export const Container = styled.View<{
  backgroundColor: string;
  colorScheme: ColorSchemeProps;
}>`
  background-color: ${({ backgroundColor }: { backgroundColor: string }) =>
    backgroundColor};
  border-radius: 33px;
  padding: 5px 20px;
  width: 180px;
  height: 180px;
  justify-content: space-between;
  border: 1px solid;
  border-color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "#000" : "#585858"};
`;

export const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const PreviewText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: white;
`;

export const IconWrapper = styled.View`
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 6px;
`;

export const ContentWrapper = styled.View``;

export const TitleText = styled.Text`
  font-size: 18px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
`;

export const TagPill = styled.Text`
  align-self: flex-start;
  padding: 4px 10px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
`;
