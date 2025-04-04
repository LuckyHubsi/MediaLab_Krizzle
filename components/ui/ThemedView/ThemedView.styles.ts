import styled from "styled-components/native";

export const StyledView = styled.View<{ backgroundColor: string }>`
  padding: 0px 20px 0px 20px;
  background-color: ${({ backgroundColor }: { backgroundColor: string }) =>
    backgroundColor};
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 12px;
  font-family: "Lexend_400Regular";
`;
