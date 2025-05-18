import { View, ViewProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  BackgroundCard,
  GradientBackgroundWrapper,
  StyledView,
} from "./GradientBackgroundCollection.styles";
import { SafeAreaView } from "react-native-safe-area-context";
import CollectionList from "@/components/ui/CollectionList/CollectionList";
import { ThemedView } from "../ThemedView/ThemedView";
import { CustomStyledHeader } from "../CustomStyledHeader/CustomStyledHeader";

export type GradientBackgroundProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  topPadding?: number;
  backgroundCardTopOffset?: number;
  listNames?: string[];
  setSelectedList?: (selectedList: string) => void;
};

export function GradientBackgroundCollection({
  lightColor,
  darkColor,
  topPadding = 30,
  style,
  children,
  backgroundCardTopOffset,
  listNames = [],
  setSelectedList,
  ...otherProps
}: GradientBackgroundProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Background layers */}
      <GradientBackgroundWrapper
        colors={["#4599E8", "#583FE7"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1, // Set zIndex lower than other elements
        }}
      ></GradientBackgroundWrapper>

      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        <StyledView topPadding={topPadding} style={style} {...otherProps}>
          {children}
        </StyledView>
      </SafeAreaView>
    </View>
  );
}
