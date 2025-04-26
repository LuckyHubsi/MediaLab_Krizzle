import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  DividerContainer,
  DividerLine,
  LabelWrapper,
} from "./DividerWithLabel.styles";
import { ThemedText } from "@/components/ThemedText";
import { View } from "react-native";

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
  iconColor = "#888",
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
              color={iconColor}
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
            style={{ color: iconColor }}
          >
            {label}
          </ThemedText>
        )}
      </LabelWrapper>
      <DividerLine />
    </DividerContainer>
  );
};
