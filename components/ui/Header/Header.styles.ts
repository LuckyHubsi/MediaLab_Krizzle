import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";

export const StyledHeader = styled.View<{ colorScheme: "light" | "dark" }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    Colors[colorScheme].cardBackground};
`;

export const Title = styled.Text<{ colorScheme: "light" | "dark" }>`
  font-family: Lexend;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: -0.6px;
  margin-left: 8px;
  color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    Colors[colorScheme].text};
`;

export const IconButton = styled.TouchableOpacity`
  padding: 8px;
`;
