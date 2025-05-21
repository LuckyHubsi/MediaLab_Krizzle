import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

export const FolderContainer = styled.View`
  height: 60px;
  width: 90%;
  border-radius: 16px;
  background-color: ${Colors.primary};
`;

export const FolderShape = styled.View`
  background-color: ${Colors.secondary};
  height: 75%;
  width: 100%;
  border-radius: 0px 8px 16px 16px;
  position: absolute;
  bottom: 0;
  left: 0;
`;

export const FolderTab = styled.View`
  background-color: ${Colors.secondary};
  height: 10%;
  width: 40%;
  position: absolute;
  bottom: 75%;
  left: 0;
  border-radius: 8px 8px 0px 0;
`;
