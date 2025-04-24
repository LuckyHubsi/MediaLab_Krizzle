import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export const StyledHeader = styled.View<{ colorScheme: "light" | "dark" }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px;
  background-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? "#FBFBFB" : "#111111"};
`;

export const BackIcon = styled(Ionicons)<{ colorScheme: "light" | "dark" }>`
  font-size: 24px;
  color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? "black" : "white"};
  margin-right: 15px;
  margin-top: 5px;
  margin-left: 5px;
`;

export const Icon = styled(Ionicons)<{ colorScheme: "light" | "dark" }>`
  font-size: 24px;
  color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? "black" : "white"};
  margin: 6px;
`;
export const IconContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;
