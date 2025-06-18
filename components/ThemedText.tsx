import { Text, type TextProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import { useActiveColorScheme } from "@/context/ThemeContext";

/**
 * ThemedText component that renders text with theming support.
 * It allows customization of text color, font weight, font size, and alignment.
 * @lightColor - Color for light theme.
 * @darkColor - Color for dark theme.
 * @fontWeight - Font weight of the text, can be "light", "regular", "semibold", or "bold".
 * @fontSize - Size of the text, can be "regular", "xxl", "xl", "l", or "s".
 * @colorVariant - Predefined color variants for the text.
 * @textIsCentered - If true, centers the text.
 */

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  fontWeight?: "light" | "regular" | "semibold" | "bold";
  fontSize?: "regular" | "xxl" | "xl" | "l" | "s";
  colorVariant?:
    | "default"
    | "red"
    | "grey"
    | "white"
    | "lightGrey"
    | "primary"
    | "disabled"
    | "black"
    | "cancel"
    | "greyScale";
  textIsCentered?: boolean;
  isTransparent?: boolean;
  optionalRef?: any;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  fontWeight = "regular",
  fontSize = "regular",
  colorVariant = "default",
  textIsCentered = false,
  isTransparent,
  optionalRef,
  ...rest
}: ThemedTextProps) {
  const theme = useActiveColorScheme();
  const themeColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text",
  );

  const color = (() => {
    switch (colorVariant) {
      case "red":
        return theme === "dark" ? Colors.dark.negative : Colors.light.negative;
      case "grey":
        return Colors.grey100;
      case "lightGrey":
        return Colors.grey50;
      case "white":
        return Colors.white;
      case "primary":
        return theme === "dark" ? Colors.secondary : Colors.primary;
      case "black":
        return Colors.black;
      case "greyScale":
        return theme === "dark" ? Colors.grey50 : Colors.grey100;
      case "disabled":
        return theme === "dark" ? Colors.grey100 : Colors.grey50;
      case "cancel":
        return theme === "dark" ? Colors.grey50 : Colors.grey100;
      case "default":
      default:
        return themeColor;
    }
  })();

  const fontWeightStyles = {
    light: { fontFamily: "Lexend_300Light" },
    regular: { fontFamily: "Lexend_400Regular" },
    semibold: { fontFamily: "Lexend_600SemiBold" },
    bold: { fontFamily: "Lexend_700Bold" },
  };

  const fontSizeStyles = {
    regular: { fontSize: 16 },
    xxl: { fontSize: 32 },
    xl: { fontSize: 28 },
    l: { fontSize: 24 },
    s: { fontSize: 14 },
  };

  return (
    <Text
      style={[
        { color: isTransparent ? Colors.white : color },
        fontWeight === "light" ? fontWeightStyles.light : undefined,
        fontWeight === "regular" ? fontWeightStyles.regular : undefined,
        fontWeight === "semibold" ? fontWeightStyles.semibold : undefined,
        fontWeight === "bold" ? fontWeightStyles.bold : undefined,
        fontSize === "regular" ? fontSizeStyles.regular : undefined,
        fontSize === "xxl" ? fontSizeStyles.xxl : undefined,
        fontSize === "xl" ? fontSizeStyles.xl : undefined,
        fontSize === "l" ? fontSizeStyles.l : undefined,
        fontSize === "s" ? fontSizeStyles.s : undefined,
        textIsCentered ? { textAlign: "center" } : undefined,
        style,
      ]}
      ref={optionalRef}
      {...rest}
    />
  );
}
