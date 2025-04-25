import { Colors } from "@/constants/Colors";
import styled from "styled-components/native";

export const StyledCardWrapper = styled.View`
  margin-top: 20px;
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
  shadow-opacity: ${({ colorScheme }: { colorScheme: "light" | "dark" }) =>
    colorScheme === "light" ? 0.085 : 0.02};
  shadow-radius: 20px;
  elevation: 6;
`;
export const ListCOntainer = styled.View`
  display: flex;
  height: 47px;

  justify-content: center;
  align-items: center;
  gap: 10px;
  align-self: stretch;

  border-radius: 33px;
  background: #4599e8;
`;

export const CollectionListText = styled.Text<{
  colorScheme: "light" | "dark";
}>`
  color: #ffffff;
  font-family: Lexend;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px; /* 150% */
  letter-spacing: -0.4px;
  text-align: center;
`;
