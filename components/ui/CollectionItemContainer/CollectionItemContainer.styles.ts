import styled from "styled-components/native";

export const ItemContainer = styled.View`
  gap: 6px;
`;
export const SelectableContainer = styled.View`
  background-color: transparent;
  border: 1px solid #eaeaea;
  border-radius: 33px;
  display: flex;
  padding: 4px 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

export const SubtitleText = styled.Text`
  color: #585858;
  text-align: left;

  font-family: Lexend;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 171.429% */
  letter-spacing: -0.35px;
`;

export const SelectableText = styled.Text`
  color: #585858;
  text-align: center;

  font-family: Lexend;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  letter-spacing: -0.4px;
`;
