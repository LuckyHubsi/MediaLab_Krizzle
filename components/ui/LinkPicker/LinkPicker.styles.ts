import { Colors } from "@/constants/Colors";
import { ColorSchemeProps } from "@/context/ThemeContext";
import styled from "styled-components/native";

export const ImagePickerContainer = styled.View`
  gap: 8px;
`;

export const LinkPickerContainer = styled.View`
  align-items: center;
  justify-content: center;
  gap: 0px;
  width: 100%;
  padding: 20px;
  border-radius: 16px;
  border-width: 1px;
  border-color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "dark" ? Colors.grey100 : Colors.grey50};
  margin-bottom: 5px;
  margin-top: -15px;
`;

export const LinkTitleButton = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
  gap: 2px;
  min-height: 48px;
`;
