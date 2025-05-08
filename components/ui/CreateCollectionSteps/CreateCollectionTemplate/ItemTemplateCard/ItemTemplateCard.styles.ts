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
  border-radius: 33px;
  margin-top: 10px;
  padding: 20px;
  gap: 15px;
  border-width: 1px;
  border-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
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
`;
