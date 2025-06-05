import React from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import {
  LinkContainer,
  IconWrapper,
  ArrowWrapper,
} from "./Settingslink.styles";
import type { LinkProps } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";

/**
 * Component for rendering a linkbox for the Manu page with an icon and label, which navigates to a specified route when pressed.
 *
 * @param label (required) - The text label to display in the linkbox.
 * @param href (required) - The route to navigate to when the linkbox is pressed.
 * @param iconName (required) - The name of the icon to display in the linkbox, using Material Icons.
 */

type SettingsLinkProps = {
  label: string;
  href: LinkProps["href"];
  iconName: keyof typeof MaterialIcons.glyphMap;
};

export const SettingsLink = ({ label, href, iconName }: SettingsLinkProps) => {
  const router = useRouter();
  const colorScheme = useActiveColorScheme() ?? "light";

  return (
    <LinkContainer colorScheme={colorScheme} onPress={() => router.push(href)}>
      <IconWrapper>
        <MaterialIcons
          name={iconName}
          size={24}
          color={Colors[colorScheme].text}
        />
      </IconWrapper>
      <ThemedText fontSize="regular" fontWeight="regular">
        {label}
      </ThemedText>
      <ArrowWrapper>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={28}
          color={Colors[colorScheme].text}
        />
      </ArrowWrapper>
    </LinkContainer>
  );
};
