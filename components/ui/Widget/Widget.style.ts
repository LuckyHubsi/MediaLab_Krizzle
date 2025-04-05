import styled from "styled-components/native";

export const CardSolid = styled.View<{ backgroundColor: string }>`
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
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
`;
