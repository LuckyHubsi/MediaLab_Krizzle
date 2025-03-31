import React from "react";
import { View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function TabBarBackground() {
  const colorScheme = useColorScheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? "light"].background,
        opacity: 0.8,
      }}
    />
  );
}
