import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #eee;
  border-radius: 9999px;
  padding: 12px 20px;
  width: 100%;
  max-width: 400px;
  gap: 12px;
`;

export const SearchIcon = styled(MaterialCommunityIcons).attrs({
  name: "magnify",
  size: 24,
  color: "#555",
})``;

export const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: #333;
  background-color: transparent;
`;
