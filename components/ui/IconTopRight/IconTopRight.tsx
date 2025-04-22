import React from "react";
import { IconWrapper } from "./IconTopRight.styles";

type IconTopRightProps = {
  children: React.ReactNode;
};

export const IconTopRight: React.FC<IconTopRightProps> = ({ children }) => {
  return <IconWrapper>{children}</IconWrapper>;
};
