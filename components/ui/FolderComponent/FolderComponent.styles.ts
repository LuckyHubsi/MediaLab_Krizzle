import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

type CardProps = { cardWidth: number };

export const FolderContainer = styled.View<CardProps>`
  width: ${({ cardWidth }: CardProps) => `${cardWidth}px`};
  height: 110px;
  border-radius: 25px;
  background-color: ${Colors.primary};
`;

export const FolderShape = styled.View`
  background-color: ${Colors.secondary};
  height: 75%;
  width: 100%;
  border-radius: 0px 16px 25px 25px;
  position: absolute;
  bottom: 0;
  left: 0;
`;

export const FolderContent = styled.View`
  position: absolute;
  bottom: 15px;
  left: 15px;
  z-index: 1;
  max-width: 80%;
`;

export const FolderTab = styled.View`
  background-color: ${Colors.secondary};
  height: 10%;
  width: 40%;
  position: absolute;
  bottom: 75%;
  left: 0;
  border-radius: 16px 16px 0px 0;
`;
