import { Colors } from "@/constants/Colors";
import { ColorSchemeProps } from "@/context/ThemeContext";
import styled from "styled-components/native";

export const TemplateSelectCard = styled.View<ColorSchemeProps>`
  width: 100%;
  background-color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light"
      ? Colors.light.background
      : Colors.dark.cardBackground};
  border-radius: 33px;
  margin-top: 10px;
  padding: 20px;
  gap: 15px;
  border-width: 1px;
  border-color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "#EAEAEA" : "#242424"};
`;
export const CardTitleRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const CardTitle = styled.View`
  flex-direction: row;
  align-items: baseline;
`;

export const CardPreview = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 5px;
  padding: 10px;
  min-height: 50px;
  position: absolute;
  right: 0px;
  padding-right: 0px;
`;
