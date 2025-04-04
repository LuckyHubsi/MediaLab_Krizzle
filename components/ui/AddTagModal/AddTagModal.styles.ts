import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";

export const ModalBackground = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
`;

export const ModalContainer = styled.View<{ colorScheme: "light" | "dark" }>`
  background-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    Colors[colorScheme].cardBackground};
  padding: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

export const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const StyledInput = styled.TextInput<{ colorScheme: "light" | "dark" }>`
  flex: 1;
  padding: 12px 16px;
  font-size: 16px;
  font-family: Lexend;
  border: 1px solid #ccc;
  border-radius: 12px;
  margin-right: 10px;
  color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? "#000" : "#fff"};
`;
