import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export const StyledHeader = styled.View<{ colorScheme: "light" | "dark" }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 0 17px 0;
  background-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    Colors[colorScheme].cardBackground};
`;

export const BackIcon = styled(Ionicons)<{ colorScheme: "light" | "dark" }>`
  font-size: 24px;
  color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? "black" : "white"};
  margin-right: 15px;
  margin-top: 5px;
  margin-left: 5px;
`;
