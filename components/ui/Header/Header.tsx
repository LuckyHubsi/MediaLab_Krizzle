import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StyledHeader, BackIcon } from "./Header.styles";
//import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import Ionicons from "@expo/vector-icons/Ionicons";

interface HeaderProps {
  title: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  onIconPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  iconName,
  onIconPress,
}) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme() ?? "light";

  const color = colorScheme === "dark" ? "#fff" : "#000";

  return (
    <StyledHeader colorScheme={colorScheme}>
      {/* Back button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <BackIcon name="chevron-back-outline" colorScheme={colorScheme} />
        <ThemedText fontSize="l" fontWeight="semibold">
          {title}
        </ThemedText>
      </TouchableOpacity>

      {/* Optional right icon */}
      {iconName && onIconPress && (
        <BackIcon onPress={onIconPress}>
          <Ionicons
            name={iconName}
            size={24}
            color={colorScheme === "light" ? "black" : "white"}
          />
        </BackIcon>
      )}
    </StyledHeader>
  );
};
