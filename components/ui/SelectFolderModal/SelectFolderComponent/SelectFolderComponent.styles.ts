import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

interface FolderProps {
  selected: boolean;
}

export const FolderContainer = styled.View`
  position: relative;
  width: 100%;
  align-items: center;
`;

export const Folder = styled.View<FolderProps>`
  background-color: ${({ selected }: FolderProps) =>
    selected ? Colors.secondary : Colors.grey50};
  height: 60px;
  width: 90%;
  border-radius: 16px;
`;

export const FolderShape = styled.View<FolderProps>`
  background-color: ${({ selected }: FolderProps) =>
    selected ? Colors.primary : Colors.grey100};
  height: 75%;
  width: 100%;
  border-radius: 0px 8px 16px 16px;
  position: absolute;
  bottom: 0;
  left: 0;
`;

export const FolderTab = styled.View<FolderProps>`
  background-color: ${({ selected }: FolderProps) =>
    selected ? Colors.primary : Colors.grey100};
  height: 10%;
  width: 40%;
  position: absolute;
  bottom: 75%;
  left: 0;
  border-radius: 8px 8px 0px 0;
`;
