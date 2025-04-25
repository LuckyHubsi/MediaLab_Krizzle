import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";

export const DividerContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-vertical: 10px;
`;

export const DividerLine = styled.View<{ colorScheme: "light" | "dark" }>`
  flex: 1;
  height: 1px;
  border-bottom-width: 1px;
  border-style: dashed;
  border-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "dark" ? Colors.grey100 : Colors.grey50};
`;

export const LabelWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-horizontal: 8px;
`;
