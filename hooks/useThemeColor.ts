import { Colors } from "@/constants/Colors";
import { useActiveColorScheme } from "@/context/ThemeContext";

/**
 * Hook to get the theme color based on the current color scheme.
 * @param props - Optional colors for light and dark themes.
 * @param colorName - The name of the color to retrieve from the Colors constant.
 */

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const theme = useActiveColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
