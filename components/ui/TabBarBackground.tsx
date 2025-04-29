import React from "react";
import { View } from "react-native";
import { Colors } from "@/constants/Colors";
import { useActiveColorScheme } from "@/context/ThemeContext";

export default function TabBarBackground() {
  const colorScheme = useActiveColorScheme();
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
