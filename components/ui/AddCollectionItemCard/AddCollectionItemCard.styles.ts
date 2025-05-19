import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

export const StyledCardWrapper = styled.View`
  margin-top: 10px;
  width: 100%;
  background-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    Colors[colorScheme].cardBackground};
  padding: 25px 20px;
  gap: 30px;
  border-radius: 25px;
`;
