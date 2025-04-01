import { ViewProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyledView } from "./ThemedView.styles";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  lightColor,
  darkColor,
  style,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );

  return (
    <StyledView
      backgroundColor={backgroundColor}
      style={style}
      {...otherProps}
    />
  );
}
