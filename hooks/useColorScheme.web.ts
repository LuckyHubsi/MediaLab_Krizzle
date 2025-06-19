import { useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

/**
 * Function to get the current color scheme of the device.
 * @returns The current color scheme of the device, either "light" or "dark".
 */

export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return "light";
}
