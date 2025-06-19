import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  DividerContainer,
  DividerLine,
  LabelWrapper,
} from "./DividerWithLabel.styles";
import { ThemedText } from "@/components/ThemedText";
import { View } from "react-native";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";

/**
 * Component for rendering a divider with an optional label and icon.
 * @param label - The text label to display in the center of the divider (defaults to optional).
 * @param iconName - The name of the Material Icons icon to display.
 */

interface DividerProps {
  label?: string;
  iconName?: keyof typeof MaterialIcons.glyphMap;
}

export const DividerWithLabel = ({
  label = "optional",
  iconName,
}: DividerProps) => {
  const colorScheme = useActiveColorScheme();
  return (
    <DividerContainer
      accessible={true}
      accessibilityLabel={label}
      accessibilityHint={
        label === "optional" ? "The input fields below are optional" : ""
      }
      accessibilityRole="text"
    >
      <DividerLine colorScheme={colorScheme} />
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
              size={16}
              color={colorScheme === "dark" ? Colors.grey50 : Colors.grey100}
              style={{
                marginBottom: label ? 10 : 0,
                marginTop: label ? 4 : 0,
              }}
              accessible={false}
              importantForAccessibility="no"
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
      <DividerLine colorScheme={colorScheme} />
    </DividerContainer>
  );
};
