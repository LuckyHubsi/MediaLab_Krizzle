import React from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import {
  LinkContainer,
  IconWrapper,
  ArrowWrapper,
  LabelWrapper,
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
 * @param accessHint (required) - The accessibility hint used for screenreaders.
 */

type SettingsLinkProps = {
  label: string;
  href: LinkProps["href"];
  iconName: keyof typeof MaterialIcons.glyphMap;
  accessHint: string;
};

export const SettingsLink = ({
  label,
  href,
  iconName,
  accessHint,
}: SettingsLinkProps) => {
  const router = useRouter();
  const colorScheme = useActiveColorScheme() ?? "light";

  return (
    <LinkContainer
      colorScheme={colorScheme}
      onPress={() => router.push(href)}
      accessibilityRole="menuitem"
      accessibilityLabel={label}
      accessibilityHint={accessHint}
    >
      <IconWrapper accessible={false}>
        <MaterialIcons
          name={iconName}
          size={24}
          color={Colors[colorScheme].text}
        />
      </IconWrapper>
      <LabelWrapper accessible={false}>
        <ThemedText
          fontSize="regular"
          fontWeight="regular"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {label}
        </ThemedText>
      </LabelWrapper>
      <ArrowWrapper accessible={false}>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={28}
          color={Colors[colorScheme].text}
        />
      </ArrowWrapper>
    </LinkContainer>
  );
};
