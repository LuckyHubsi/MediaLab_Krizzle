import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

export const FolderContainer = styled.View`
  width: 45%;
  height: 110px;
  border-radius: 25px;
  background-color: ${Colors.primary};
`;

export const FolderShape = styled.View`
  background-color: ${Colors.secondary};
  height: 75%;
  width: 100%;
  border-radius: 25px 16px 25px 25px;
  position: absolute;
  bottom: 0;
  left: 0;
`;

export const FolderContent = styled.View`
  position: absolute;
  bottom: 15;
  left: 15;
  z-index: 1;
  max-width: 80%;
`;

export const FolderTab = styled.View`
  background-color: ${Colors.secondary};
  height: 50%;
  width: 40%;
  position: absolute;
  top: 15;
  left: 0;
  border-radius: 16px;
`;
