import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

export const StyledCardWrapper = styled.View`
  width: 100%;
  background-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? "#FBFBFB" : "#242424"};
  padding: 25px 20px;
  gap: 30px;
  border-radius: 25px;

  /* Shadows */
  shadow-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    Colors[colorScheme].cardShadowColor};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.085;
  shadow-radius: 20px;
  elevation: 6;
`;
