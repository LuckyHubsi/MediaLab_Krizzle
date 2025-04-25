import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  DividerContainer,
  DividerLine,
  LabelWrapper,
} from "./DividerWithLabel.styles";
import { ThemedText } from "@/components/ThemedText";

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
          <MaterialIcons
            name={iconName}
            size={iconSize}
            color={iconColor}
            style={{
              transform:
                iconName === "arrow-back" ? [{ rotate: "-90deg" }] : [],
              marginRight: label ? 4 : 0,
              marginTop: label ? 4 : 0,
            }}
          />
        )}
        {label && (
          <ThemedText
            fontSize="s"
            fontWeight="regular"
            style={{ color: iconColor, marginRight: label ? 4 : 0 }}
          >
            {label}
          </ThemedText>
        )}
      </LabelWrapper>
      <DividerLine />
    </DividerContainer>
  );
};
