import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
type CardProps = { cardWidth: number };

export const CardSolid = styled.View<CardProps>`
  width: ${({ cardWidth }: CardProps) => `${cardWidth}px`};
  padding: ${({ padding }: { padding: number }) => `${padding}px`};
  aspect-ratio: 1;
  border-radius: 33px;
  justify-content: flex-end;
`;

export const CardGradient = styled(LinearGradient)<{
  cardWidth: number;
  padding: number;
}>`
  width: ${({ cardWidth }: CardProps) => `${cardWidth}px`};
  padding: ${({ padding }: { padding: number }) => `${padding}px`};
  aspect-ratio: 1;
  border-radius: 33px;
  padding: 20px;
  justify-content: flex-end;
`;

export const IconsContainer = styled.View`
  position: absolute;
  top: 20px;
  right: 20px;
  flex-direction: row;
  gap: 6px;
`;

export const Icon = styled.View`
  width: 35px;
  height: 35px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  justify-content: center;
  align-items: center;
`;

export const Tag = styled.Text`
  font-family: Lexend_400Regular;
  color: #111111;
  font-size: 12px;
  margin-top: 4px;
  border-radius: 33px;
  letter-spacing: -0.3px;
  padding: 4px 10px;
  background-color: rgba(255, 255, 255, 0.7);
  align-self: flex-start;
  font-weight: 400;
`;

export const PreviewWrapper = styled.View`
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 1;
`;
