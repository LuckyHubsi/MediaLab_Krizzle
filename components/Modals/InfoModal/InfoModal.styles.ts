import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";

export const PopupBackdrop = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const PopupContainer = styled.View<{ colorScheme: "light" | "dark" }>`
  background-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light"
      ? Colors.light.cardBackground
      : Colors.dark.cardBackground};
  width: 85%;
  max-width: 400px;
  border-bottom-left-radius: 28px;
  border-bottom-right-radius: 28px;
  overflow: hidden;
  align-items: center;
  padding: 20px;
`;

export const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 10;
`;

export const PopupImage = styled.Image`
  width: 85%;
  height: 240px;
  border-top-left-radius: 28px;
  border-top-right-radius: 28px;
`;

export const PopupHeader = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
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
