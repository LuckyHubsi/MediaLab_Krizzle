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
  flex-wrap: wrap;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 2px;
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
  margin-top: 8px;
`;

export const TagPill = styled.View<{
  isSelected: boolean;
  colorScheme: string;
}>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 20px;
  min-width: 48px;
  background-color: ${({
    isSelected,
    colorScheme,
  }: {
    isSelected: boolean;
    colorScheme: "light" | "dark";
  }) =>
    isSelected
      ? Colors.primary
      : colorScheme === "light"
        ? Colors[colorScheme].pillBackground
        : Colors[colorScheme].pillBackground};
`;

export const EditTextContainer = styled.TouchableOpacity`
  height: 48;
`;
