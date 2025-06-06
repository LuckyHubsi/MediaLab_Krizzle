import { Text, type TextProps } from "react-native";
import { Lexend_400Regular } from "@expo-google-fonts/lexend/400Regular";
import { Lexend_300Light } from "@expo-google-fonts/lexend/300Light";
import { Lexend_600SemiBold } from "@expo-google-fonts/lexend/600SemiBold";
import { Lexend_700Bold } from "@expo-google-fonts/lexend/700Bold";

import { useThemeColor } from "@/hooks/useThemeColor";

import { Colors } from "@/constants/Colors";
import { useActiveColorScheme } from "@/context/ThemeContext";

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
};

const colorVariants = {
  default: (lightColor?: string, darkColor?: string) =>
    useThemeColor({ light: lightColor, dark: darkColor }, "text"),
  red: () =>
    useActiveColorScheme() === "dark"
      ? Colors.dark.negative
      : Colors.light.negative,
  grey: () => Colors.grey100,
  lightGrey: () => Colors.grey50,
  white: () => Colors.white,
  primary: () =>
    useActiveColorScheme() === "dark" ? Colors.primary : Colors.secondary,
  black: () => Colors.black,
  greyScale: () =>
    useActiveColorScheme() === "dark" ? Colors.grey50 : Colors.grey100,
  disabled: () =>
    useActiveColorScheme() === "dark" ? Colors.grey100 : Colors.grey50,
  cancel: () =>
    useActiveColorScheme() === "dark" ? Colors.grey50 : Colors.grey100,
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
  ...rest
}: ThemedTextProps) {
  const theme = useActiveColorScheme();
  const themeColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text",
  ); // ✅ Always called

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
        return themeColor; // ✅ Use the hook result
    }
  })();

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
      {...rest}
    />
  );
}

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
