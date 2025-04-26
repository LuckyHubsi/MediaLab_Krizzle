import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

interface ButtonProps {
  isDisabled: boolean;
}

export const StyledButtonContainer = styled.TouchableHighlight.attrs<ButtonProps>(
  (props: { isDisabled: any }) => ({
    underlayColor: props.isDisabled
      ? "transparent"
      : Colors.light.buttonPressed,
    activeOpacity: props.isDisabled ? 1 : 0.7,
  }),
)<ButtonProps>`
  width: 50px;
  height: 50px;
  border-radius: 50px;
  background-color: ${({ isDisabled }: ButtonProps) =>
    isDisabled ? Colors.grey50 : Colors.primary};
  justify-content: center;
  align-items: center;
  align-self: center;
`;
