import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

export const StyledButtonContainer = styled.TouchableHighlight.attrs({
  underlayColor: Colors.light.buttonPressed,
  activeOpacity: 0.7,
})`
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background-color: ${Colors.light.tint};
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 32px;
  right: 15px;
  align-self: center;
`;
