import React from "react";
import { Text, TouchableOpacity } from "react-native";
import {
  StyledHeader,
  BackIcon,
  IconContainer,
  Icon,
  TitleContainer,
} from "./CustomStyledHeader.styles";
import { ThemedText } from "@/components/ThemedText";
import { useNavigation, usePathname, useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";

interface HeaderProps {
  title: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  iconName2?: keyof typeof MaterialIcons.glyphMap;
  onIconPress?: () => void;
  onIconMenuPress?: () => void;
  backBehavior?:
    | "default"
    | "goHome"
    | "goArchive"
    | "goSettings"
    | "goCollection";
  otherBackBehavior?: () => void;
  param?: string;
  leftIconName?: keyof typeof MaterialIcons.glyphMap;
  isTransparent?: boolean;
}

export const CustomStyledHeader: React.FC<HeaderProps> = ({
  title,
  iconName,
  iconName2,
  onIconPress,
  onIconMenuPress,
  backBehavior = "default",
  otherBackBehavior,
  param,
  leftIconName,
  isTransparent,
}) => {
  const router = useRouter();
  const colorScheme = useActiveColorScheme() ?? "light";
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (otherBackBehavior) {
      otherBackBehavior();
    }

    if (backBehavior === "goHome") {
      router.replace("/");
    } else if (backBehavior === "goArchive") {
      router.replace("/archive");
    } else if (backBehavior === "goSettings") {
      router.replace("/settings");
    } else if (backBehavior === "goCollection") {
      router.replace({
        pathname: "/collectionPage",
        params: { pageId: param },
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <StyledHeader colorScheme={colorScheme} isTransparent={isTransparent}>
      <TouchableOpacity
        onPress={handleBackPress}
        style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
      >
        <BackIcon name="chevron-back-outline" colorScheme={colorScheme} />

        <TitleContainer>
          <ThemedText
            fontSize="xl"
            fontWeight="semibold"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </ThemedText>
        </TitleContainer>
      </TouchableOpacity>
      {leftIconName && (
        <MaterialIcons
          name={leftIconName}
          size={24}
          color={Colors[colorScheme].text}
          style={{
            marginRight: 8,
            backgroundColor:
              colorScheme === "light"
                ? Colors.light.searchBarBackground
                : Colors.dark.searchBarBackground,
            borderRadius: 8,
            padding: 2,
          }}
        />
      )}
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
