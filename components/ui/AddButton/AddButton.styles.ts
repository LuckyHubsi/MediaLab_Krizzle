import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

export const StyledButtonContainer = styled.TouchableHighlight.attrs({
  underlayColor: Colors.light.buttonPressed,
  activeOpacity: 0.7,
})`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${Colors.light.tint};
  justify-content: center;
  align-items: center;
  align-self: center;
`;
