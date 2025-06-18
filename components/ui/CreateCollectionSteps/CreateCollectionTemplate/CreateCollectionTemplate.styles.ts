import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";
import { Card } from "../../Card/Card";
import { ColorSchemeProps } from "@/context/ThemeContext";

export const ItemCountContainer = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 10px 0 0 0;
`;

export const ItemCount = styled.View<ColorSchemeProps>`
  width: 48%;
  flex-direction: row;
  border-radius: 33px;
  border: 1px solid
    ${({ colorScheme }: ColorSchemeProps) => Colors[colorScheme].placeholder};
  padding: 10px 15px;
`;

export const RatingIconsContainer = styled.View`
  width: 100%;
  gap: 8px;
`;

export const IconContainer = styled.View`
  flex-direction: row;
  gap: 10px;
`;

export const AddMultiSelectablesContainer = styled.View`
  width: 100%;
  gap: 10px;
`;

export const AddMultiSelectableButton = styled.TouchableOpacity`
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: center;
  border-radius: 33px;
  padding: 10px 0;
  min-height: 48px;
  border: 1px solid ${Colors.primary};
`;

export const SelectablesContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const TextfieldWrapper = styled.View`
  width: 90%;
`;

export const CardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const CardText = styled.View`
  flex-direction: column;
  gap: 10px;
`;
