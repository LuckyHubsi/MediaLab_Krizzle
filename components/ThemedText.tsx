import { Text, type TextProps, StyleSheet } from "react-native";
import { Lexend_400Regular } from "@expo-google-fonts/lexend/400Regular";
import { Lexend_300Light } from "@expo-google-fonts/lexend/300Light";
import { Lexend_600SemiBold } from "@expo-google-fonts/lexend/600SemiBold";
import { Lexend_700Bold } from "@expo-google-fonts/lexend/700Bold";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  fontWeight?: "light" | "regular" | "semibold" | "bold";
  fontSize?: "regular" | "xxl" | "xl" | "s";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  fontWeight = "regular",
  fontSize = "regular",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        fontWeight === "light" ? fontWeightStyles.light : undefined,
        fontWeight === "regular" ? fontWeightStyles.regular : undefined,
        fontWeight === "semibold" ? fontWeightStyles.semibold : undefined,
        fontWeight === "bold" ? fontWeightStyles.bold : undefined,
        fontSize === "regular" ? fontSizeStyles.regular : undefined,
        fontSize === "xxl" ? fontSizeStyles.xxl : undefined,
        fontSize === "xl" ? fontSizeStyles.xl : undefined,
        fontSize === "s" ? fontSizeStyles.s : undefined,
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
  s: { fontSize: 14 },
};
