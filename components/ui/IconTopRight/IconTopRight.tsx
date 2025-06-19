import React from "react";
import { TouchableOpacity } from "react-native";
import { IconWrapper } from "./IconTopRight.styles";

/**
 * Component for rendering an icon in the top right corner of the screen.
 *
 * @param children (required) - The icon or content to display.
 * @param onPress - Callback function to handle press events.
 */

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
