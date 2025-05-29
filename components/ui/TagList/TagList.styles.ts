import styled from "styled-components/native";
import { TouchableOpacity, Text, View } from "react-native";
import { Colors } from "@/constants/Colors";

interface TagProps {
  active?: boolean;
  themeMode?: "light" | "dark";
}

// Outer touch target wrapper
export const TagContainer = styled(TouchableOpacity).attrs({
  hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
})`
  margin-right: 10px;
  justify-content: center;
  align-items: center;
  height: 48px;
  min-width: 48px;
`;

// Visual pill button inside
export const TagButton = styled(View)<TagProps>`
  background-color: ${({ active, themeMode }: TagProps) =>
    active
      ? Colors.light.tint
      : themeMode === "dark"
        ? Colors.dark.pillBackground
        : Colors.light.pillBackground};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 33px;
  padding-horizontal: 16px;
  padding-vertical: 6px;
  height: 32px;
`;

export const TagText = styled(Text)<TagProps>`
  color: ${({ active, themeMode }: TagProps) =>
    active
      ? "#fff"
      : themeMode === "dark"
        ? Colors.dark.text
        : Colors.light.text};
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.4px;
  font-family: "Lexend_400Regular";
`;
