import styled from "styled-components/native";

interface ToastContainerProps {
  background: string;
}

export const ToastContainer = styled.View<ToastContainerProps>`
  background-color: ${({ background }: ToastContainerProps) => background};
  flex-direction: row;
  gap: 10px;
  padding: 20px 18px;
  border-radius: 16px;
  width: 90%;
`;
