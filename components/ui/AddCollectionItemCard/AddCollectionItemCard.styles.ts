import { Colors } from "@/constants/Colors";
import { ColorSchemeProps } from "@/hooks/useColorScheme";
import styled from "styled-components/native";

export const StyledCardWrapper = styled.View`
  margin-top: 20px;
  width: 100%;
  height: 550px;
  background-color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "#FBFBFB" : "#242424"};
  padding: 25px 20px;
  gap: 30px;
  border-radius: 25px;

  /* Shadows */
  shadow-color: ${({ colorScheme }: ColorSchemeProps) =>
    Colors[colorScheme].cardShadowColor};
  shadow-offset: 0px 0px;
  shadow-opacity: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? 0.085 : 0.02};
  shadow-radius: 20px;
  elevation: 6;
`;
