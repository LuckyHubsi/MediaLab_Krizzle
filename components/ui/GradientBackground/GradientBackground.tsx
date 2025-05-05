import { View, ViewProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  BackgroundCard,
  GradientBackgroundWrapper,
  StyledView,
} from "./GradientBackground.styles";
import { SafeAreaView } from "react-native-safe-area-context";

export type GradientBackgroundProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  topPadding?: number;
  backgroundCardTopOffset?: number;
};

export function GradientBackground({
  lightColor,
  darkColor,
  topPadding = 30,
  style,
  children,
  backgroundCardTopOffset,
  ...otherProps
}: GradientBackgroundProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Background layers */}
      <GradientBackgroundWrapper colors={["#4599E8", "#583FE7"]} />

      <BackgroundCard
        backgroundColor={backgroundColor}
        topOffset={backgroundCardTopOffset}
      />

      {/* Foreground content */}
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        <StyledView topPadding={topPadding} style={style} {...otherProps}>
          {children}
        </StyledView>
      </SafeAreaView>
    </View>
  );
}
