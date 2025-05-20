import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { ColorSchemeProps } from "@/context/ThemeContext";

export const Container = styled.View`
  width: 100%;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const BackIcon = styled(Ionicons)<ColorSchemeProps>`
  font-size: 12px;
  color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? Colors.grey100 : Colors.grey50};
`;

export const ViewAllText = styled.Text<ColorSchemeProps>`
  font-family: Lexend;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.35px;
  color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "#585858" : "#ABABAB"};
`;

export const TagScrollView = styled.ScrollView`
  flex-direction: row;
`;

export const TagPill = styled.View<{
  isSelected: boolean;
  colorScheme: ColorSchemeProps;
}>`
  flex-direction: row;
  margin-top: 3px;
  align-items: center;
  padding: 5px 15px;
  margin-right: 4px;
  border-radius: 33px;
  background-color: ${({
    isSelected,
    colorScheme,
  }: {
    isSelected: boolean;
    colorScheme: "light" | "dark";
  }) =>
    isSelected
      ? Colors[colorScheme].tint
      : colorScheme === "light"
        ? Colors[colorScheme].pillBackground
        : Colors[colorScheme].pillBackground};
`;
