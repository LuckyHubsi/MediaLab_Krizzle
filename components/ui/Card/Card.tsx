import React, { FC, PropsWithChildren } from "react";
import { StyledCard } from "./Card.styles";
import { useActiveColorScheme } from "@/context/ThemeContext";

/** Component for displaying a card-like container with customizable width and height.
 * It can be used to wrap content in a visually distinct area.
 * @param width - Optional width of the card (default: "100%).
 * @param height - Optional height of the card (default: "auto).
 */

interface CardProps {
  width?: string;
  height?: string;
}

export const Card: FC<PropsWithChildren<CardProps>> = ({
  children,
  width = "100%",
  height = "auto",
}) => {
  const colorScheme = useActiveColorScheme() ?? "light";

  return (
    <StyledCard colorScheme={colorScheme} width={width} height={height}>
      {children}
    </StyledCard>
  );
};

export default Card;
