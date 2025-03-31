import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleProp, TextStyle } from "react-native";

export type MaterialIconName = React.ComponentProps<
  typeof MaterialIcons
>["name"];

export function Icon({
  name,
  size = 24,
  color,
  style,
}: {
  name: MaterialIconName;
  size?: number;
  color: string;
  style?: StyleProp<TextStyle>;
}) {
  return <MaterialIcons name={name} size={size} color={color} style={style} />;
}
