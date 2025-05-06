import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";

type ColorSchemeProps = {
  colorScheme: "light" | "dark";
};

type PopupItemProps = {
  isLast: boolean;
};

export const ModalBackground = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const ModalBox = styled.View<ColorSchemeProps>`
  background-color: ${({ colorScheme }: ColorSchemeProps) =>
    Colors[colorScheme].cardBackground};
  border-radius: 16px;
  gap: 4px;
  width: 80%;
`;

export const PopupItem = styled.TouchableOpacity<
  PopupItemProps & ColorSchemeProps
>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px 20px;
  border-bottom-width: ${({ isLast }: PopupItemProps) =>
    isLast ? "0px" : "1px"};
  border-bottom-color: ${({ colorScheme }: ColorSchemeProps) =>
    Colors[colorScheme].pillBackground};
`;

export const IconContainer = styled.View`
  margin-left: 16px;
`;
