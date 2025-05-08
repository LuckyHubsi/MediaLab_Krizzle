import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";
import { View, Platform } from "react-native";

export const StyledCard = styled(View)<{
  colorScheme: "light" | "dark";
  width: string;
  height: string;
}>`
  width: ${({ width }: { width: string }) => width};
  height: ${({ height }: { height: string }) => height};
  background-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    Colors[colorScheme].cardBackground};
  border-radius: 33px;
  padding: 20px;
  border-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? "#EAEAEA" : "#242424"};
`;
