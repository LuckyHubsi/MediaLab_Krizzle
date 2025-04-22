import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { StyledHeader, BackIcon } from "./CustomStyledHeader.styles";
import { ThemedText } from "@/components/ThemedText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

interface HeaderProps {
  title: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  onIconPress?: () => void;
  backBehavior?: "default" | "goHome" | "goArchive" | "goSettings";
}

export const CustomStyledHeader: React.FC<HeaderProps> = ({
  title,
  iconName,
  onIconPress,
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
      {iconName && onIconPress && (
        <BackIcon onPress={onIconPress}>
          <MaterialIcons
            name={iconName}
            size={24}
            color={colorScheme === "light" ? "black" : "white"}
          />
        </BackIcon>
      )}
    </StyledHeader>
  );
};
