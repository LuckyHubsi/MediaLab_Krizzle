import { TouchableOpacity, Text } from "react-native";
import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";

interface CollectionListProps {
  active?: boolean;
  themeMode?: "light" | "dark";
}
export const CollectionListContainer = styled(
  TouchableOpacity,
)<CollectionListProps>`
  background-color: ${({ active, themeMode }: CollectionListProps) =>
    active
      ? Colors.widget.blue
      : themeMode === "dark"
        ? Colors.dark.pillBackground
        : Colors.light.pillBackground};
  display: flex;
  width: 124px;
  height: 42px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 33px;
  margin-right: 6px;
`;

export const CollectionListText = styled(Text)<CollectionListProps>`
  color: ${({ active, themeMode }: CollectionListProps) =>
    active
      ? "#fff"
      : themeMode === "dark"
        ? Colors.dark.text
        : Colors.light.text};
  font-family: Lexend;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 150% */
  letter-spacing: -0.4px;
  text-align: center;
`;
