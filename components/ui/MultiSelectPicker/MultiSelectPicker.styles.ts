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
  background-color: ${({ isSelected }: { isSelected: boolean }) =>
    isSelected ? Colors.primary : Colors.grey50};
  padding: 4px 12px;
  border-radius: 33px;
`;
