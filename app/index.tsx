import { useEffect } from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Index() {
  useEffect(() => {
    const checkOnboarding = async () => {
      const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");
      if (hasOnboarded === "true") {
        router.replace("/(tabs)");
      } else {
        router.replace("/onboardingScreen");
      }
    };

    checkOnboarding();
  }, []);

  return <View style={{ flex: 1, backgroundColor: "#fff" }} />;
}
