import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";
import { Platform } from "react-native";
import { ColorSchemeProps } from "@/context/ThemeContext";

export const StyledButtonContainer = styled.TouchableHighlight.attrs({
  underlayColor: Colors.light.buttonPressed,
  activeOpacity: 0.7,
})<{ colorScheme: ColorSchemeProps }>`
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background-color: ${Colors.light.tint};
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: ${Platform.OS === "ios" ? "48px" : "25px"};
  right: 15px;
  align-self: center;
  border: 2px solid
    ${({ colorScheme }: ColorSchemeProps) => Colors[colorScheme].background};
`;
