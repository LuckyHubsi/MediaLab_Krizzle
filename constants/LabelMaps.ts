import { Colors } from "@/constants/Colors";
import { Icons } from "@/constants/Icons";

/**
 * This file contains label maps for colors and icons used throughout the application.
 * It provides human-readable labels for colors and icons, mapping them to their respective keys.
 */

// Hex -> Human readable label
export const colorLabelMap: Record<string, string> = {};
// Human readable label -> widget key
export const colorKeyMap: Record<string, keyof typeof Colors.widget> = {};
// Color ID (key) -> Human readable label
export const colorIdLabelMap: Record<string, string> = {};

/**
 * Maps colors from the Colors.widget object to human-readable labels.
 * It also creates a reverse mapping from human-readable labels to color keys.
 */
Object.entries(Colors.widget).forEach(([key, value]) => {
  const humanName = key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());

  if (typeof value === "string") {
    colorLabelMap[value] = humanName;
  } else if (Array.isArray(value)) {
    value.forEach((v) => {
      colorLabelMap[v] = humanName;
    });
  }

  colorKeyMap[humanName] = key as keyof typeof Colors.widget;
  colorIdLabelMap[key] = humanName;
});

// This maps icon names to human-readable labels, e.g., "coffee" -> "Coffee
export const iconLabelMap: Record<string, string> = Icons.reduce(
  (acc, icon) => {
    acc[icon] =
      icon
        .split("-")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" ") + " Icon";
    return acc;
  },
  {} as Record<string, string>,
);
