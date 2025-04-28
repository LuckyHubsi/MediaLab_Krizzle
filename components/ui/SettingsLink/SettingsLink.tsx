import React from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons"; // 👈 Import MaterialIcons
import {
  LinkContainer,
  IconWrapper,
  ArrowWrapper,
} from "./Settingslink.styles";
import type { LinkProps } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "@/components/ThemedText";

type SettingsLinkProps = {
  label: string;
  href: LinkProps["href"];
  iconName: keyof typeof MaterialIcons.glyphMap; // 👈 Icon name prop
};

export const SettingsLink = ({ label, href, iconName }: SettingsLinkProps) => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light"; // fallback to 'light' if null

  return (
    <LinkContainer colorScheme={colorScheme} onPress={() => router.push(href)}>
      <IconWrapper>
        <MaterialIcons
          name={iconName}
          size={24}
          color={colorScheme === "light" ? "black" : "white"}
        />
      </IconWrapper>
      <ThemedText fontSize="regular" fontWeight="regular">
        {label}
      </ThemedText>
      <ArrowWrapper>
        <MaterialIcons
          name="keyboard-arrow-right"
          size={28}
          color={colorScheme === "light" ? "black" : "white"}
        />
      </ArrowWrapper>
    </LinkContainer>
  );
};
