import React from "react";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "react-native";
import {
  Container,
  Card,
  PreviewImage,
  LabelWrapper,
  RadioButtonOuter,
  RadioButtonInner,
  ModeContainer,
} from "./ThemeSelector.styles";
import { useActiveColorScheme } from "@/context/ThemeContext";

type ThemeOption = "light" | "dark";

type ThemeSelectorProps = {
  selected: ThemeOption;
  onSelect: (theme: ThemeOption) => void;
};

export const ThemeSelector = ({ selected, onSelect }: ThemeSelectorProps) => {
  return (
    <Container>
      {(["light", "dark"] as ThemeOption[]).map((option) => (
        <ModeContainer>
          <Card
            key={option}
            onPress={() => onSelect(option)}
            isSelected={selected === option}
          >
            <PreviewImage
              source={
                option === "light"
                  ? require("@/assets/images/theme_light.png")
                  : require("@/assets/images/theme_dark.png")
              }
            />
          </Card>
          <LabelWrapper>
            <ThemedText fontSize="regular" fontWeight="regular">
              {option === "light" ? "Light" : "Dark"}
            </ThemedText>
            <RadioButtonOuter isSelected={selected === option}>
              {selected === option && <RadioButtonInner />}
            </RadioButtonOuter>
          </LabelWrapper>
        </ModeContainer>
      ))}
    </Container>
  );
};
