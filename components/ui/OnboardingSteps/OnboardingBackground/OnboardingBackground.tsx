import {
  useColorScheme,
  View,
  Image,
  StyleProp,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type OnboardingBackgroundProps = {
  imageSourceLight: any;
  imageSourceDark: any;
  heightPercent?: number;
  style?: StyleProp<ViewStyle>;
};

export default function OnboardingBackground({
  imageSourceLight,
  imageSourceDark,
  heightPercent = 65,
  style,
}: OnboardingBackgroundProps) {
  const colorScheme = useColorScheme();
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
    >
      <LinearGradient
        colors={["rgba(255,255,255,0.75)", "#4599E8"]}
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
