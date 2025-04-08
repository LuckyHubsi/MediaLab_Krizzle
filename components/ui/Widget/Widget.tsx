import React from "react";
import { TouchableOpacity, useWindowDimensions } from "react-native";
import { Colors } from "@/constants/Colors";
import {
  IconsContainer,
  Icon,
  Title,
  Tag,
  CardSolid,
  CardGradient,
} from "./Widget.style";

type ColorKey = keyof typeof Colors.widget;

type Props = {
  title: string;
  label: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  color: ColorKey;
  onPress?: () => void;
};

const Widget: React.FC<Props> = ({
  title,
  label,
  iconLeft,
  iconRight,
  color,
  onPress,
}) => {
  const { width } = useWindowDimensions();
  const columns = width >= 768 ? 3 : 2;
  const spacing = 19 * (columns + 1);
  const cardWidth = (width - spacing) / columns;

  const background = Colors.widget[color];
  const isGradient = Array.isArray(background);

  const CardWrapper = isGradient ? CardGradient : CardSolid;

  const cardProps = isGradient
    ? {
        colors: background,
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        cardWidth,
      }
    : { backgroundColor: background, cardWidth };

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <CardWrapper {...cardProps}>
        {(iconLeft || iconRight) && (
          <IconsContainer>
            {iconLeft && <Icon>{iconLeft}</Icon>}
            {iconRight && <Icon>{iconRight}</Icon>}
          </IconsContainer>
        )}
        <Title>{title}</Title>
        <Tag>{label}</Tag>
      </CardWrapper>
    </TouchableOpacity>
  );
};

export default Widget;
