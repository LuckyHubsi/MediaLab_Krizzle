import styled from "styled-components/native";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 4.5 * 12) / 2; // two items + 3 margins

export const CardContainer = styled.View<{ backgroundColor: string }>`
  width: ${cardWidth}px;
  aspect-ratio: 1;
  border-radius: 24px;
  padding: 16px;
  justify-content: flex-end;
  background-color: ${(props: { backgroundColor: any }) =>
    props.backgroundColor};
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
`;

export const IconsContainer = styled.View`
  position: absolute;
  top: 12px;
  right: 12px;
  flex-direction: row;
  gap: 6px;
`;

export const Title = styled.Text`
  color: white;
  font-weight: 700;
  font-size: 16px;
`;

export const Label = styled.Text`
  color: white;
  font-size: 12px;
  margin-top: 4px;
`;
