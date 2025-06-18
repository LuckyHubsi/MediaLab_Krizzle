import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Keyboard, Platform, View } from "react-native";
import { FloatingAddButton } from "@/components/ui/NavBar/FloatingAddButton/FloatingAddButton";
import { ModalSelection } from "@/components/Modals/CreateNCModal/CreateNCModal";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useActiveColorScheme } from "@/context/ThemeContext";

/**
 * TabLayout component that renders the main tab layout for the app.
 * It includes three tabs: Home, Folders, and Settings and a FloatingAddButton.
 */

export default function TabLayout() {
  const colorScheme = useActiveColorScheme();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  /**
   * Listens for keyboard show/hide events and updates `keyboardVisible` state.
   * Adds event listeners when the component mounts and cleans them up on unmount.
   * Helps track if the keyboard is currently open.
   */
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true),
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false),
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme].tabBarActiveTintColor,
          tabBarInactiveTintColor: Colors[colorScheme].tabBarInactiveTintColor,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: () =>
            Platform.OS === "android" && isKeyboardVisible ? null : (
              <TabBarBackground />
            ),
          tabBarHideOnKeyboard: Platform.OS === "android",
          tabBarLabelStyle: {
            fontFamily: "Lexend_400Regular",
            fontSize: 12,
          },
          tabBarStyle: {
            position: Platform.OS === "ios" ? "absolute" : "relative",
            height:
              Platform.OS === "android" && isKeyboardVisible
                ? 0
                : Platform.OS === "ios"
                  ? 90
                  : 65,
            paddingTop: Platform.OS === "ios" ? 5 : 2,
            backgroundColor:
              Platform.OS === "android" && isKeyboardVisible
                ? "transparent"
                : Colors[colorScheme].tabBarBackgroundColor,
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
          name="folders"
          options={{
            title: "Folders",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="folder" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Menu",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="widgets" size={24} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* FloatingAddButton only visible if keyboard is not open on Android */}
      {!(Platform.OS === "android" && isKeyboardVisible) && (
        <View
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
          }}
        >
          <FloatingAddButton onPress={() => setModalVisible(true)} />
        </View>
      )}

      <ModalSelection
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
