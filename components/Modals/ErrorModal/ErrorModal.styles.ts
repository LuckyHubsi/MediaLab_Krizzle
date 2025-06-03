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
  border-radius: 28px;
  padding: 20px 15px;
  border: 1px solid
    ${({ colorScheme }: ColorSchemeProps) =>
      colorScheme === "dark" ? Colors.grey100 : Colors.grey50};
`;

export const TopContentContainer = styled.View`
  width: 100%;
  height: 160px;
  align-items: center;
`;

export const BottomContentContainer = styled.View`
  width: 100%;
  align-items: center;
`;

export const PopupText = styled.Text`
  font-size: 14px;
  text-align: center;
  margin-bottom: 20px;
`;

interface CTAButtonProps extends ColorSchemeProps {
  isRed?: boolean;
}

export const CTAButton = styled.TouchableOpacity<CTAButtonProps>`
  background-color: ${({ isRed, colorScheme }: CTAButtonProps) =>
    isRed ? Colors[colorScheme].negative : Colors.tintColor};
  padding: 12px 32px;
  border-radius: 99px;
  align-self: center;
`;

export const CTAButtonText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: 600;
`;

export const NavigationContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 50%;
  margin: 10px 0;
  position: relative;
`;

export const ChevronButton = styled.TouchableOpacity`
  position: absolute;
  padding: 10px;
`;

export const LeftChevronButton = styled(ChevronButton)`
  left: 0;
`;

export const RightChevronButton = styled(ChevronButton)`
  right: 0;
  color:;
`;

export const IndicatorText = styled.Text<ColorSchemeProps>`
  font-size: 14px;
  color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "dark" ? "white" : "black"};
`;
