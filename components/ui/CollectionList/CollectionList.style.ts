import styled from "styled-components/native";

export const CollectionListContainer = styled.View<{
  colorScheme: "light" | "dark";
}>`
  display: flex;
  width: 124px;
  height: 42px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 33px;
  background: #4599e8;
  margin-right: 6px;
`;

export const CollectionListText = styled.Text<{
  colorScheme: "light" | "dark";
}>`
  color: #ffffff;
  font-family: Lexend;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 150% */
  letter-spacing: -0.4px;
  text-align: center;
`;
