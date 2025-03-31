import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { FloatingAddButton } from "@/components/ui/NavBar/FloatingAddButton/FloatingAddButton";
import { HapticTab } from "@/components/HapticTab";
import { Icon } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarLabelStyle: {
          fontFamily: "Lexend_400Regular",
          fontSize: 12,
        },
        tabBarStyle: {
          position: Platform.OS === "ios" ? "absolute" : "relative",
          height: 65,
          backgroundColor: Colors[colorScheme ?? "light"].background,
          opacity: 0.8,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="archive"
        options={{
          title: "Archive",
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="archive" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="settings" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="addPage"
        options={{
          title: "",
          tabBarIcon: () => null, // Icon is handled inside the custom button
          tabBarButton: (props) => <FloatingAddButton {...props} />,
        }}
      />
    </Tabs>
  );
}
