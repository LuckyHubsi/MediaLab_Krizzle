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
      ? themeMode === "light"
        ? Colors.white
        : Colors.black
      : "transparent"};
  display: flex;
  border-top-width: 1px;
  border-left-width: 1px;
  border-right-width: 1px;
  border-bottom-width: 0px;
  border-color: ${({ themeMode }: CollectionListProps) =>
    themeMode === "light" ? Colors.white : Colors.black};
  border-style: solid;
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 25px 25px 0px 0px;
  margin-right: 6px;
`;

export const CollectionListText = styled(Text)<CollectionListProps>`
  color: ${({ active, themeMode }: CollectionListProps) =>
    active
      ? Colors.widget.blue
      : themeMode === "light"
        ? Colors.white
        : Colors.black};
  font-family: Lexend_400Regular;
  font-size: 16px;
  font-style: normal;
  font-weight: ${({ active }: CollectionListProps) => (active ? 900 : 400)};
  line-height: 24px; /* 150% */
  letter-spacing: -0.4px;
  text-align: center;
`;
