import styled from "styled-components/native";

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
