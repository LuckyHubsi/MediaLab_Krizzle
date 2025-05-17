import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

type ThemeOption = "light" | "dark";

export const ModeContainer = styled.View`
  flex-direction: column;
`;

export const Container = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

interface CardProps {
  isSelected: boolean;
}

export const Card = styled.TouchableOpacity<CardProps>`
  width: 140px;
  border-radius: 20px;
  border: 2px solid
    ${({ isSelected }: CardProps) => (isSelected ? "#007AFF" : "#ccc")};
  align-items: center;
  overflow: hidden;
`;

export const PreviewImage = styled.Image`
  width: 100%;
  height: 200px;
  resize-mode: cover;
`;

export const LabelWrapper = styled.View`
  margin-top: 10px;
  align-items: center;
`;

export const RadioButtonOuter = styled.View<CardProps>`
  margin-top: 8px;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${({ isSelected }: CardProps) =>
    isSelected ? Colors.primary : Colors.grey50};
  justify-content: center;
  align-items: center;
`;

export const RadioButtonInner = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: #007aff;
`;

export const ResetContainer = styled.View`
  padding: 15px 10px 0 10px;
  flex-direction: row;
  margin-top: 20px;
  align-items: center;
  justify-content: space-between;
  border-top-width: 1px;
  border-top-color: ${Colors.grey50};
  border-style: dash;
`;
