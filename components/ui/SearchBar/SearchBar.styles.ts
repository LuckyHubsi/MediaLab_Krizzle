import styled from "styled-components/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

export const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border-radius: 33px;
  padding: 10px 20px;
  width: 100%;
  gap: 6px;
`;

export const SearchIcon = styled(MaterialCommunityIcons)``;

export const SearchInput = styled.TextInput`
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  letter-spacing: -0.4px;
  background-color: transparent;
  padding-vertical: 0px;
  flex: 1;
  font-family: "Lexend_400Regular";
`;
