import React, { FC, PropsWithChildren } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StyledCard } from "./Card.styles";

interface CardProps {
  width?: string;
  height?: string;
}

export const Card: FC<PropsWithChildren<CardProps>> = ({
  children,
  width = "100%",
  height = "auto",
}) => {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <StyledCard colorScheme={colorScheme} width={width} height={height}>
      {children}
    </StyledCard>
  );
};
