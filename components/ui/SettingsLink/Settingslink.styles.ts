import styled from "styled-components/native";
import { TouchableOpacity } from "react-native";

type ColorSchemeProps = {
  colorScheme: "light" | "dark";
};

export const LinkContainer = styled(TouchableOpacity)<ColorSchemeProps>`
  flex-direction: row;
  align-items: center;
  padding: 5px 10px;
`;

export const IconWrapper = styled.View`
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

export const ArrowWrapper = styled.View`
  margin-left: auto;
`;
