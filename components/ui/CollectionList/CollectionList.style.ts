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
  background-color: ${({ active }: CollectionListProps) =>
    active ? Colors.white : "transparent"};
  display: flex;

  padding: 10px 20px;s
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 25px 25px 0px 0px;
  margin-right: 6px;
`;

export const CollectionListText = styled(Text)<CollectionListProps>`
  color: ${({ active }: CollectionListProps) =>
    active ? Colors.widget.blue : "ffffff"};
  font-family: Lexend;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 150% */
  letter-spacing: -0.4px;
  text-align: center;
`;
