import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

interface StepProps {
  isActive: boolean;
  theme: any;
  colorScheme: "light" | "dark";
}
export const Container = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

export const Step = styled.View<StepProps>`
  width: ${({ isActive }: StepProps) => (isActive ? "50px" : "10px")};
  height: 10px;
  border-radius: 6px;
  background-color: ${({ isActive, colorScheme }: StepProps) =>
    isActive
      ? Colors.primary
      : colorScheme === "light"
        ? Colors.grey100
        : Colors.grey50};
`;
