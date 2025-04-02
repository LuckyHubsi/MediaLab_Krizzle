import styled from "styled-components/native";

export const StyledView = styled.View<{ backgroundColor: string }>`
  padding: 20px;
  background-color: ${({ backgroundColor }: { backgroundColor: string }) =>
    backgroundColor};
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: "Lexend_400Regular";
`;
