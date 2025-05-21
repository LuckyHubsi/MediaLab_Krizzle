import { Colors } from "@/constants/Colors";
import { ColorSchemeProps } from "@/context/ThemeContext";
import styled from "styled-components/native";

export const StyledModalContent = styled.View<ColorSchemeProps>`
  position: absolute;
  bottom: 0;
  background-color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? Colors.white : Colors.grey200};
  align-items: center;
  gap: 20px;
  width: 100%;
  max-height: 70%;
  border-radius: 33px 33px 0 0;
  padding: 30px;
`;

export const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 15px;
`;

export const BottomButtonBaseStyling = styled.TouchableOpacity`
  flex: 1;
  padding-vertical: 19px;
  align-items: center;
  border-radius: 33px;
`;

export const CancelButton = styled(BottomButtonBaseStyling)<ColorSchemeProps>`
  border: 1px solid ${Colors.grey50};
`;

interface NextButtonProps {
  selectedFolder: boolean;
}

export const NextButton = styled(BottomButtonBaseStyling)<NextButtonProps>`
  background-color: ${({ selectedFolder }: NextButtonProps) =>
    selectedFolder ? Colors.primary : Colors.grey100};
`;

export const FolderList = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 5px;
`;
