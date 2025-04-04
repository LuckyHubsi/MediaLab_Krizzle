// components/WidgetCard.tsx

import React from "react";
import styled from "styled-components/native";
import { Text, TouchableOpacity } from "react-native";
import { CardContainer, IconsContainer, Label, Title } from "./Widget.style";
import { Colors } from "@/constants/Colors";

type ColorKey = keyof typeof Colors.widget;

type Props = {
  title: string;
  label: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  color: ColorKey; // <== this is what fixes the error
  onPress?: () => void; // Optional onPress handler
};

export const Widget: React.FC<Props> = ({
  title,
  label,
  iconLeft,
  iconRight,
  color,
  onPress,
}) => {
  const backgroundColor = Colors.widget[color];

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <CardContainer backgroundColor={backgroundColor}>
        <IconsContainer>
          {iconLeft}
          {iconRight}
        </IconsContainer>
        <Title>{title}</Title>
        <Label>{label}</Label>
      </CardContainer>
    </TouchableOpacity>
  );
};

export default Widget;
