import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";

export const StyledEmptyHome = styled.View<{ colorScheme: "light" | "dark" }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  height: 100%;
  width: 100%;
  display: flex;
  gap: 20px;
`;
