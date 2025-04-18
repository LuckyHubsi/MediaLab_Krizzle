import styled from "styled-components/native";

export const Overlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const ModalBox = styled.View`
  width: 300px;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  shadow-color: #000;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 5;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const Message = styled.Text`
  margin-bottom: 20px;
`;

export const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

export const Action = styled.Pressable`
  margin-left: 12px;
`;

export const ActionText = styled.Text<{ color?: string }>`
  color: ${(props: { color: any }) => props.color || "#000"};
`;
