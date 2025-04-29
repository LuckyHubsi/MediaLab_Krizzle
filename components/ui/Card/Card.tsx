import React, { FC, PropsWithChildren } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StyledCard } from "./Card.styles";

export const Card: FC<PropsWithChildren> = ({ children }) => {
  const colorScheme = useColorScheme() ?? "light";

  return <StyledCard colorScheme={colorScheme}>{children}</StyledCard>;
};
