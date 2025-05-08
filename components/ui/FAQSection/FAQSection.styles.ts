import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";

type ColorSchemeProps = {
  colorScheme: "light" | "dark";
};

export const GradientBorder = styled(LinearGradient).attrs({
  colors: ["#4599E8", "#583FE7"],
  start: { x: 0.14, y: 0 },
  end: { x: 1, y: 0 },
})`
  border-radius: 14px;
  padding: 1px;
`;

export const CollapsibleCardContainer = styled.View<ColorSchemeProps>`
  background-color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? Colors.white : Colors.grey200};
  border-radius: 14px;
  padding: 12px 20px;
`;

export const CardHeader = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const GradientTopBorder = styled(LinearGradient).attrs({
  colors: ["#4599E8", "#583FE7"],
  start: { x: 0.14, y: 0 },
  end: { x: 1, y: 0 },
})`
  height: 1px;
  width: 100%;
  margin-bottom: 12px;
`;

export const CollapsibleCardContent = styled.View`
  padding: 10px 0px;
`;

export const CardsContainer = styled.View`
  flex-direction: column;
  gap: 10px;
`;

export const ImageContainer = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
`;
