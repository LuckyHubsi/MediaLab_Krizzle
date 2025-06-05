import { ViewProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyledView } from "./ThemedView.styles";

/**
 * Component for rendering a themed view padding and background color based on the active color scheme.
 *
 * @param lightColor - The color for light mode background.
 * @param darkColor - The color for dark mode background.
 * @param topPadding - The padding at the top of the content (default: 20).
 */

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
