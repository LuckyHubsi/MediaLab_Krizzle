import React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "expo-router";
import { StyledHeader, BackIcon } from "./Header.styles";
import { ThemedText } from "@/components/ThemedText";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { Colors } from "react-native/Libraries/NewAppScreen";

/**
 * Component for rendering a header with a title and an optional icon.
 *
 * @param title (required) - The title to display in the header.
 * @param iconName - Name of the icon to display on the right side.
 * @param onIconPress - Callback function to handle icon press events.
 *
 */

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
  const colorScheme = useActiveColorScheme() ?? "light";

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
          <Ionicons name={iconName} size={24} color={Colors.colorScheme.text} />
        </BackIcon>
      )}
    </StyledHeader>
  );
};
