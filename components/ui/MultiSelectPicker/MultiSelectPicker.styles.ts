import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";

export const MultiSelectContainer = styled.View`
  width: 100%;
  gap: 8px;
`;

export const MultiSelectPicker = styled.View`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

export const IndividualSelect = styled.TouchableOpacity<{
  isSelected: boolean;
}>`
  min-height: 48px;
  min-width: 48px;
`;

export const TagPill = styled.View<{
  isSelected: boolean;
}>`
  background-color: ${({ isSelected }: { isSelected: boolean }) =>
    isSelected ? Colors.primary : Colors.grey25};
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 12px;
  border-radius: 33px;
  margin-right: 6px;
  margin-top: 12px;
`;
