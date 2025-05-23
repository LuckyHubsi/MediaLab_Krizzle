import React from "react";
import { TouchableOpacity } from "react-native";
import { IconWrapper } from "./IconTopRight.styles";

type IconTopRightProps = {
  children: React.ReactNode;
  onPress?: () => void;
};

export const IconTopRight: React.FC<IconTopRightProps> = ({
  children,
  onPress,
}) => {
  return (
    <IconWrapper as={TouchableOpacity} onPress={onPress}>
      {children}
    </IconWrapper>
  );
};
