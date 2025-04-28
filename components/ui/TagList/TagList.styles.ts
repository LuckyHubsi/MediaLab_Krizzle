import styled from "styled-components/native";
import { TouchableOpacity, Text } from "react-native";
import { Colors } from "@/constants/Colors";
import { ColorSchemeProps } from "@/hooks/useColorScheme";

interface TagProps {
  active?: boolean;
}

export const TagButton = styled(TouchableOpacity)<TagProps>`
  background-color: ${({ active, colorScheme }: TagProps & ColorSchemeProps) =>
    active
      ? Colors.widget.blue
      : colorScheme === "dark"
        ? Colors.dark.pillBackground
        : Colors.light.pillBackground};
  border-radius: 33px;
  margin-right: 10px;
  padding: 6px 16px;
  justify-content: center;
  align-items: center;
`;

export const TagText = styled(Text)<TagProps>`
  color: ${({ active, colorScheme }: TagProps & ColorSchemeProps) =>
    active
      ? "#fff"
      : colorScheme === "dark"
        ? Colors.dark.text
        : Colors.light.text};
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.4px;
`;
