import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";
import { Platform } from "react-native";

export const DividerContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const DividerLine = styled.View<{ colorScheme: "light" | "dark" }>`
  flex: 1;
  height: 0.1px;
  border-bottom-width: 1px;
  background-color: transparent;
  border-style: ${Platform.OS === "ios" ? "solid" : "dashed"};
  border-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "dark" ? Colors.grey100 : Colors.grey50};
`;

export const LabelWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin-horizontal: 8px;
`;
