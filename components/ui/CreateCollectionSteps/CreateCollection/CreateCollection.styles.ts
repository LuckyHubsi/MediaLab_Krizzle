import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
`;

export const ScrollContainer = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    paddingBottom: 85,
  },
  showsVerticalScrollIndicator: false,
}))``;

export const ContentWrapper = styled.View`
  flex: 1;
  align-items: center;
  gap: 20px;
  width: 100%;
`;

export const TwoColumnRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 15px;
`;

export const ButtonContainer = styled.View`
  width: 100%;
`;
