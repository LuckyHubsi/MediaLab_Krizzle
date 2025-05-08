import { TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

// export const Container = styled.View`
//   flex: 1;
// `;

export const AddButtonWrapper = styled.View`
  width: 100%;
  align-items: center;
  margin-bottom: 20px;
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
