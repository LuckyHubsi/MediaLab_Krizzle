import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  StyledHeader,
  BackIcon,
  IconContainer,
} from "./CustomStyledHeader.styles";
import { ThemedText } from "@/components/ThemedText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRouter } from "expo-router";

interface HeaderProps {
  title: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconMenu?: keyof typeof Ionicons.glyphMap;
  onIconPress?: () => void;
  onIconMenuPress?: () => void;
  backBehavior?: "default" | "goHome" | "goArchive" | "goSettings";
}

export const CustomStyledHeader: React.FC<HeaderProps> = ({
  title,
  iconName,
  iconMenu,
  onIconPress,
  onIconMenuPress,
  backBehavior = "default",
}) => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (backBehavior === "goHome") {
      router.replace("/");
    } else if (backBehavior === "goArchive") {
      router.replace("/archive");
    } else if (backBehavior === "goSettings") {
      router.replace("/settings");
    } else {
      navigation.goBack();
    }
  };

  return (
    <StyledHeader colorScheme={colorScheme}>
      <TouchableOpacity
        onPress={handleBackPress}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <BackIcon name="chevron-back-outline" colorScheme={colorScheme} />
        <ThemedText fontSize="xl" fontWeight="semibold">
          {title}
        </ThemedText>
      </TouchableOpacity>

      {/* Optional right icon */}
      <IconContainer>
        {iconName && onIconPress && (
          <BackIcon onPress={onIconPress}>
            <Ionicons
              name={iconName}
              size={24}
              color={colorScheme === "light" ? "black" : "white"}
            />
          </BackIcon>
        )}
        {iconMenu && onIconMenuPress && (
          <BackIcon onPress={onIconMenuPress}>
            <Ionicons
              name={iconMenu}
              size={24}
              color={colorScheme === "light" ? "black" : "white"}
            />
          </BackIcon>
        )}
      </IconContainer>
    </StyledHeader>
  );
};
