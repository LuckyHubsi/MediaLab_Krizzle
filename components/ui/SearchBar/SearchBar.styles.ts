import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border-radius: 33px;
  padding: 16px 20px;
  width: 100%;
  height: 56px;
  gap: 6px;
`;

export const SearchIcon = styled(MaterialCommunityIcons)``;

export const SearchInput = styled.TextInput`
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  letter-spacing: -0.4px;
  background-color: transparent;
  flex: 1;
  font-family: "Lexend_400Regular";
  padding-vertical: 10px;
  min-height: 56px;
  line-height: 22px;
`;
