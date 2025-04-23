import { Colors } from "react-native/Libraries/NewAppScreen";
import styled from "styled-components/native";

export const TextfieldContainter = styled.View`
  width: 100%;
  gap: 8px;
`;

export const InputWrapper = styled.View<{ colorScheme: "light" | "dark" }>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    Colors[colorScheme].background};
  border: 1px solid
    ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
      colorScheme === "dark" ? Colors.white : Colors.grey100};
  border-radius: 16px;
  padding: 0 20px;
`;
export const StyledTextInput = styled.TextInput<{
  colorScheme: "light" | "dark";
}>`
  padding: 15px 20px;
  font-size: 16px;
  font-family: "Lexend_300Light";
  flex: 1;
  color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? "#000" : "#fff"};
`;
