import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  StyledHeader,
  BackIcon,
  IconContainer,
  Icon,
} from "./CustomStyledHeader.styles";
import { ThemedText } from "@/components/ThemedText";
import { useNavigation, useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface HeaderProps {
  title: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  iconName2?: keyof typeof MaterialIcons.glyphMap;
  onIconPress?: () => void;
  onIconMenuPress?: () => void;
  backBehavior?: "default" | "goHome" | "goArchive" | "goSettings";
}

export const CustomStyledHeader: React.FC<HeaderProps> = ({
  title,
  iconName,
  iconName2,
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
          <Icon onPress={onIconPress}>
            <MaterialIcons
              name={iconName}
              size={24}
              color={colorScheme === "light" ? "black" : "white"}
            />
          </Icon>
        )}
        {iconName2 && onIconMenuPress && (
          <Icon onPress={onIconMenuPress}>
            <MaterialIcons
              name={iconName2}
              size={24}
              color={colorScheme === "light" ? "black" : "white"}
            />
          </Icon>
        )}
      </IconContainer>
    </StyledHeader>
  );
};
