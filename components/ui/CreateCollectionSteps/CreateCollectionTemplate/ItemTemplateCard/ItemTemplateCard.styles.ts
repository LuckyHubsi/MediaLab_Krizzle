import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

type ThemeProps = {
  colorScheme: "light" | "dark";
};

export const TemplateSelectCard = styled.View`
  width: 100%;
  background-color: ${({ colorScheme }: ThemeProps) =>
    colorScheme === "light"
      ? Colors.light.background
      : Colors.dark.cardBackground};
  border-radius: 20px;
  margin-top: 10px;
  padding: 20px;
  gap: 15px;
  border: 1px solid
    ${({ colorScheme }: ThemeProps) =>
      colorScheme === "light" ? Colors.grey25 : Colors.dark.cardBackground};

  /* Shadows */
  shadow-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    Colors[colorScheme].cardShadowColor};
  shadow-offset: 0px 0px;
  shadow-opacity: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? 0.05 : 0.02};
  shadow-radius: 20px;
  elevation: 6;
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
`;
