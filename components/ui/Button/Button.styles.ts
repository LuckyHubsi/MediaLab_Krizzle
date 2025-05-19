// Button.styles.ts
import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";
import { ButtonProps } from "./Button";

export const StyledButton = styled.TouchableOpacity<ButtonProps>`
  align-items: center;
  justify-content: center;
  border-radius: 33px;
  text-align: center;
  width: 100%;
  padding-vertical: 18px;
  margin-bottom: 10px;
  background-color: ${({ isRed }: ButtonProps) =>
    isRed ? Colors.negative : Colors.tintColor};
`;
