import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  DividerContainer,
  DividerLine,
  LabelWrapper,
} from "./DividerWithLabel.styles";
import { ThemedText } from "@/components/ThemedText";
import { View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useActiveColorScheme } from "@/context/ThemeContext";

interface DividerProps {
  label?: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  iconSize?: number;
  iconColor?: string;
}

export const DividerWithLabel = ({
  label = "optional",
  iconName,
  iconSize = 16,
}: DividerProps) => {
  return (
    <DividerContainer>
      <DividerLine />
      <LabelWrapper>
        {iconName && (
          <View
            style={{
              transform:
                iconName === "arrow-back" ? [{ rotate: "-90deg" }] : [],
            }}
          >
            <MaterialIcons
              name={iconName}
              size={iconSize}
              color={
                useActiveColorScheme() === "dark"
                  ? "#ABABAB" // light grey for dark mode
                  : "#585858" // darker grey for light mode
              }
              style={{
                marginBottom: label ? 10 : 0,
                marginTop: label ? 4 : 0,
              }}
            />
          </View>
        )}
        {label && (
          <ThemedText
            fontSize="s"
            fontWeight="regular"
            colorVariant="greyScale"
          >
            {label}
          </ThemedText>
        )}
      </LabelWrapper>
      <DividerLine />
    </DividerContainer>
  );
};
