import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";

type ThemeProps = {
  colorScheme: "light" | "dark";
};

export const StyledContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const StyledBottomButtons = styled.View`
  flex-direction: column;
  justify-content: flex-end;
  gap: 15px;
  padding-bottom: 10px;
`;

export const BottomButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 15px;
`;

export const BottomButtonBaseStyling = styled.TouchableOpacity<{
  colorScheme: "light" | "dark";
}>`
  flex: 1;
  padding-vertical: 19px;
  align-items: center;
  border-radius: 33px;
`;

interface DiscardButtonProps {
  colorScheme: "light" | "dark";
  variant: "discard" | "back";
}

export const DiscardButton = styled(
  BottomButtonBaseStyling,
)<DiscardButtonProps>`
  background-color: ${({ variant, colorScheme }: DiscardButtonProps) =>
    variant === "back"
      ? Colors[colorScheme].background
      : Colors[colorScheme].background};
  border: 1px solid
    ${({ variant }: DiscardButtonProps) =>
      variant === "back" ? Colors.grey50 : Colors.negative};
`;

export const NextButton = styled(BottomButtonBaseStyling)`
  background-color: ${Colors.primary};
`;
