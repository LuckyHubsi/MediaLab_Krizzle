import { ViewProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyledView } from "./ThemedView.styles";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  topPadding?: number;
};

export function ThemedView({
  lightColor,
  darkColor,
  topPadding = 20,
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
      topPadding={topPadding}
      style={style}
      {...otherProps}
    />
  );
}
