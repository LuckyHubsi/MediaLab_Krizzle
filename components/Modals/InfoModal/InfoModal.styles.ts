import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";
import { ColorSchemeProps } from "@/context/ThemeContext";

export const PopupBackdrop = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const PopupContainer = styled.View<ColorSchemeProps>`
  background-color: ${({ colorScheme }: ColorSchemeProps) =>
    Colors[colorScheme].background};
  width: 85%;
  max-width: 350px;
  border-bottom-left-radius: 28px;
  border-bottom-right-radius: 28px;
  overflow: hidden;
  align-items: center;
  padding: 20px 15px;
  border: 1px solid
    ${({ colorScheme }: ColorSchemeProps) =>
      colorScheme === "dark" ? Colors.grey100 : Colors.grey50};
  border-top-width: 0;
`;

export const PopupImage = styled.Image`
  width: 85%;
  height: 240px;
  max-width: 350px;
  background-color: #f1f1f1;
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
  border: 1px solid
    ${({ colorScheme }: ColorSchemeProps) =>
      colorScheme === "dark" ? Colors.grey100 : Colors.grey50};
  border-bottom-width: 0;
  margin-bottom: -1px;
`;

export const PopupText = styled.Text`
  font-size: 14px;
  text-align: center;
  margin-bottom: 20px;
`;

export const CTAButton = styled.TouchableOpacity`
  background-color: ${Colors.primary};
  padding: 12px 32px;
  border-radius: 99px;
`;

export const CTAButtonText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: 600;
`;
