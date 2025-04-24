import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";

export const BottomButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
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
