import React from "react";
import { Pressable } from "react-native";
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
    <Pressable onPress={onPress} hitSlop={15} style={{ alignItems: "center" }}>
      <IconWrapper>{children}</IconWrapper>
    </Pressable>
  );
};
