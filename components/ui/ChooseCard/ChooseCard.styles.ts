import styled from "styled-components/native";
import { Colors } from "@/constants/Colors";
import { Platform } from "react-native";

export const StyledChooseCard = styled.View<{ colorScheme: "light" | "dark" }>`
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
  background-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    Colors[colorScheme].cardBackground};
  border-radius: 33px;
  position: relative;

  /* iOS Shadows */
  shadow-color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    Colors[colorScheme].cardShadowColor};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.05;
  shadow-radius: 20px;

  /* Android Shadow (Elevation) */
  ${Platform.select({
    android: `
        elevation: 8;
      `,
  })}
`;

export const EditButton = styled.View`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px;
`;

export const Circle = styled.View`
  width: 38px;
  height: 38px;
  border-radius: 40px;
  border-width: 1px;
  border-color: #585858;
  align-items: center;
  justify-content: center;
`;

export const Label = styled.Text<{ colorScheme: "light" | "dark" }>`
  font-family: Lexend;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  letter-spacing: -0.4px;
  margin-top: 6px;
  color: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? "black" : "white"};
`;
