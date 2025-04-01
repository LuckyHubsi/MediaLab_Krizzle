import styled from "styled-components/native";

export const StyledView = styled.View<{ backgroundColor: string }>`
  padding: 40px 20px 0px;
  background-color: ${({ backgroundColor }: { backgroundColor: string }) =>
    backgroundColor};
  height: 100%;
`;
