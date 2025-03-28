import { Text, type TextProps, StyleSheet } from "react-native";

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
  light: { fontFamily: "Inter_300Light" },
  regular: { fontFamily: "Inter_400Regular" },
  semibold: { fontFamily: "Inter_600SemiBold" },
  bold: { fontFamily: "Inter_700Bold" },
};

const fontSizeStyles = {
  regular: { fontSize: 16 },
  xxl: { fontSize: 24 },
  xl: { fontSize: 20 },
  s: { fontSize: 14 },
};
