import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StyledHeader, Title, IconButton } from "./Header.styles";
import { Ionicons } from "@expo/vector-icons";

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

  return (
    <StyledHeader colorScheme={colorScheme}>
      {/* Back button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <Text
          style={{
            fontSize: 20,
            color: colorScheme === "light" ? "black" : "white",
          }}
        >
          {"<"}
        </Text>
        <Title colorScheme={colorScheme}>{title}</Title>
      </TouchableOpacity>

      {/* Optional right icon */}
      {iconName && onIconPress && (
        <IconButton onPress={onIconPress}>
          <Ionicons
            name={iconName}
            size={24}
            color={colorScheme === "light" ? "black" : "white"}
          />
        </IconButton>
      )}
    </StyledHeader>
  );
};
