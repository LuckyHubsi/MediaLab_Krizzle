import { Tabs } from "expo-router";
import React, { useState } from "react";
import { Platform, View } from "react-native";
import { FloatingAddButton } from "@/components/ui/NavBar/FloatingAddButton/FloatingAddButton";
import { ModalSelection } from "@/components/ui/ModalSelection/ModalSelection";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor:
            Colors[colorScheme ?? "light"].tabBarActiveTintColor,
          tabBarInactiveTintColor:
            Colors[colorScheme ?? "light"].tabBarInactiveTintColor,
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
            backgroundColor:
              Colors[colorScheme ?? "light"].tabBarBackgroundColor,
            borderTopWidth: 0,
            paddingRight: 75,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="home-filled" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="archive"
          options={{
            title: "Archive",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="archive" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="settings" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
      <View
        style={{
          position: "absolute",

          right: 0,
          bottom: 0,
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
