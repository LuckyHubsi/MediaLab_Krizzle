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
} from "./ThemeSelector.styles";

type ThemeOption = "light" | "dark";

type ThemeSelectorProps = {
  selected: ThemeOption;
  onSelect: (theme: ThemeOption) => void;
};

export const ThemeSelector = ({ selected, onSelect }: ThemeSelectorProps) => {
  const systemColorScheme = useColorScheme();

  return (
    <Container>
      {(["light", "dark"] as ThemeOption[]).map((option) => (
        <Card
          key={option}
          onPress={() => onSelect(option)}
          isSelected={selected === option}
        >
          <PreviewImage
            source={
              option === "light"
                ? require("@/assets/images/theme-light.png")
                : require("@/assets/images/theme-dark.png")
            }
          />
          <LabelWrapper>
            <ThemedText fontSize="regular" fontWeight="regular">
              {option === "light" ? "Light" : "Dark"}
            </ThemedText>
            <RadioButtonOuter>
              {selected === option && <RadioButtonInner />}
            </RadioButtonOuter>
          </LabelWrapper>
        </Card>
      ))}
    </Container>
  );
};
