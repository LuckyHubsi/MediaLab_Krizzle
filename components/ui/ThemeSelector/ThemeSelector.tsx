import React from "react";
import { ThemedText } from "@/components/ThemedText";
import { Touchable, TouchableOpacity, useColorScheme } from "react-native";
import {
  Container,
  Card,
  PreviewImage,
  LabelWrapper,
  RadioButtonOuter,
  RadioButtonInner,
  ModeContainer,
  ResetContainer,
} from "./ThemeSelector.styles";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { useUserTheme } from "@/context/ThemeContext";
import { Button } from "../Button/Button";

type ThemeOption = "light" | "dark" | "system";

type ThemeSelectorProps = {
  selected: ThemeOption;
  onSelect: (theme: ThemeOption) => void;
};

export const ThemeSelector = ({ selected, onSelect }: ThemeSelectorProps) => {
  const systemColorScheme = useColorScheme() ?? "light";
  const { resetToSystemDefault } = useUserTheme();

  const isSystemSelected = selected === "system";

  return (
    <>
      <Container>
        {(["light", "dark"] as ThemeOption[]).map((option) => (
          <TouchableOpacity onPress={() => onSelect(option)} key={option}>
            <ModeContainer>
              <Card
                onPress={() => onSelect(option)}
                isSelected={selected === option}
              >
                <PreviewImage
                  source={
                    option === "system"
                      ? systemColorScheme === "light"
                        ? require("@/assets/images/theme_light.png")
                        : require("@/assets/images/theme_dark.png")
                      : option === "light"
                        ? require("@/assets/images/theme_light.png")
                        : require("@/assets/images/theme_dark.png")
                  }
                />
              </Card>
              <LabelWrapper>
                <ThemedText fontSize="regular" fontWeight="regular">
                  {option === "light"
                    ? "Light"
                    : option === "dark"
                      ? "Dark"
                      : "System Default"}
                </ThemedText>
                <RadioButtonOuter isSelected={selected === option}>
                  {selected === option && <RadioButtonInner />}
                </RadioButtonOuter>
              </LabelWrapper>
            </ModeContainer>
          </TouchableOpacity>
        ))}
      </Container>

      {!isSystemSelected && (
        <ResetContainer>
          <Button onPress={resetToSystemDefault}>
            <ThemedText
              fontSize="regular"
              fontWeight="regular"
              colorVariant="white"
            >
              Reset to System Default
            </ThemedText>
          </Button>
        </ResetContainer>
      )}
    </>
  );
};
