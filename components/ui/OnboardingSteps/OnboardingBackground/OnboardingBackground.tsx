import { View, Image, StyleProp, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useActiveColorScheme } from "@/context/ThemeContext";

/**
 * Component for rendering an image with a gradient background
 *
 * @param imageSourceLight (required) - Image source for light mode
 * @param imageSourceDark (required) - Image source for dark mode
 * @param heightPercent - Height of the background as a percentage of the screen height (default: 65%)
 * @param style - Additional styles for the background container
 * @param style - Additional screenreader hint
 */

type OnboardingBackgroundProps = {
  imageSourceLight: any;
  imageSourceDark: any;
  heightPercent?: number;
  style?: StyleProp<ViewStyle>;
  hint?: string;
};

export default function OnboardingBackground({
  imageSourceLight,
  imageSourceDark,
  heightPercent = 65,
  style,
  hint,
}: OnboardingBackgroundProps) {
  const colorScheme = useActiveColorScheme();
  const selectedImage =
    colorScheme === "dark" ? imageSourceDark : imageSourceLight;

  return (
    <View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: `${heightPercent}%`,
          borderBottomLeftRadius: 33,
          borderBottomRightRadius: 33,
          overflow: "hidden",
        },
        style,
      ]}
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel="Illustration"
      accessibilityHint={hint}
    >
      <LinearGradient
        colors={["#D9ECFF", "#DCD4FC"]}
        style={{ height: "100%" }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <Image
        source={selectedImage}
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          left: 0,
          right: 0,
          bottom: 0,
        }}
        resizeMode="contain"
      />
    </View>
  );
}
