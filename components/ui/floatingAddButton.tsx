import React from 'react';
import styled from 'styled-components/native';
import { GestureResponderEvent } from 'react-native';
import { IconSymbol } from './IconSymbol';

type FloatingAddButtonProps = {
    onPress?: (event: GestureResponderEvent) => void;
  };
  
  export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ onPress }) => {
    return (
      <ButtonContainer onPress={onPress} activeOpacity={0.8}>
        <IconSymbol name="plus" size={36} color="#000" />
      </ButtonContainer>
    );
  };

const ButtonContainer = styled.TouchableOpacity`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  background-color: #fdfd96;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 20px;
  align-self: center;
  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-radius: 6px;
`;
