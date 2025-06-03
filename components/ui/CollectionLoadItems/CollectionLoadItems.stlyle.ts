import { Colors } from "@/constants/Colors";
import { ColorSchemeProps } from "@/context/ThemeContext";
import styled from "styled-components/native";

export const StyledCardWrapper = styled.View<ColorSchemeProps>`
  margin-top: 0px;
  width: 100%;
  background-color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "#FBFBFB" : "#242424"};
  padding: 25px 20px;
  gap: 30px;
  border-radius: 25px;
  border-width: 1px;
  border-color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "light" ? "#EAEAEA" : "#242424"};
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
