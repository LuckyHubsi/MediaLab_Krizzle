import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";

export const GradientBackgroundWrapper = styled(LinearGradient).attrs({
  start: { x: 0, y: 0 },
  end: { x: 1, y: 0 }, // Left to right
})`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const BackgroundCard = styled.View<{
  backgroundColor: string;
  topOffset?: number;
}>`
  position: absolute;
  top: ${({ topOffset = 30 }) => `${topOffset}px`};
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ backgroundColor }: { backgroundColor: string }) =>
    backgroundColor};
  border-top-left-radius: 33px;
  border-top-right-radius: 33px;
`;

export const StyledView = styled.View<{
  topPadding: number;
}>`
  flex: 1;
  padding: ${({ topPadding }: { topPadding: number }) => `${topPadding}px`} 20px
    0px 20px;
  flex-direction: column;
  gap: 15px;
  font-family: "Lexend_400Regular";
`;
