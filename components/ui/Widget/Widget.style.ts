import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";

export const CardSolid = styled.View<{ cardWidth: number }>`
  width: ${({ cardWidth }) => `${cardWidth}px`};
  aspect-ratio: 1;
  border-radius: 33px;
  padding: 20px;
  justify-content: flex-end;
`;

export const CardGradient = styled(LinearGradient)<{ cardWidth: number }>`
  width: ${({ cardWidth }) => `${cardWidth}px`};
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
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  justify-content: center;
  align-items: center;
`;

export const Title = styled.Text`
  color: white;
  font-weight: 700;
  font-size: 16px;
`;

export const Tag = styled.Text`
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
