import { Tabs } from "expo-router";
import React, { useState } from "react";
import { Platform, View } from "react-native";
import { FloatingAddButton } from "@/components/ui/NavBar/FloatingAddButton/FloatingAddButton";
import { ModalSelection } from "@/components/ui/ModalSelection/ModalSelection";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: { position: "absolute", paddingRight: 75 },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="archive"
          options={{
            title: "Archive",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="tray.full.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="gear" color={color} />
            ),
          }}
        />
      </Tabs>
      <View
        style={{
          position: "absolute",
          bottom: Platform.OS === "ios" ? 30 : 20,
          right: 50,
        }}
      >
        <FloatingAddButton onPress={() => setModalVisible(true)} />
      </View>
      <ModalSelection
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
