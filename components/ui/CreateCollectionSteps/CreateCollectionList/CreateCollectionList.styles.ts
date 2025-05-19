import { Colors } from "@/constants/Colors";
import { TouchableOpacity, View } from "react-native";
import styled, { ThemeProps } from "styled-components/native";

// export const Container = styled.View`
//   flex: 1;
// `;

type ThemeProps = {
  colorScheme: "light" | "dark";
};

export const AddButtonWrapper = styled.View`
  width: 100%;
  align-items: center;
`;

export const ListContent = {
  paddingTop: 20,
  gap: 20,
};

export const RemoveButton = styled(TouchableOpacity)`
  margin-top: 15px;
  align-self: flex-start;
`;

export const RemoveButtonContent = styled(View)`
  padding-vertical: 8px;
  padding-horizontal: 16px;
  border-radius: 20px;
  border-width: 1px;
  border-color: #ff4d4d;
  flex-direction: row;
  align-items: center;
`;

export const ItemCountContainer = styled.View`
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 15px 0 5px 0;
`;

export const ItemCount = styled.View`
  width: 100%;
  justify-content: center;
  flex-direction: row;
  border-radius: 33px;
  border: 1px solid
    ${({ colorScheme }: ThemeProps) => Colors[colorScheme].placeholder};
  padding: 10px 15px;
`;

export const HorizontalTitleRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;
