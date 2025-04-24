import styled from "styled-components/native";
import { TouchableOpacity, Text } from "react-native";
import { Colors } from "@/constants/Colors";

interface TagProps {
  active?: boolean;
  themeMode?: "light" | "dark";
}

export const TagButton = styled(TouchableOpacity)<TagProps>`
  background-color: ${({ active, themeMode }: TagProps) =>
    active
      ? Colors.widget.blue
      : themeMode === "dark"
        ? Colors.dark.pillBackground
        : Colors.light.pillBackground};
  border-radius: 33px;
  margin-right: 10px;
  padding: 6px 16px;
  justify-content: center;
  align-items: center;
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
`;
