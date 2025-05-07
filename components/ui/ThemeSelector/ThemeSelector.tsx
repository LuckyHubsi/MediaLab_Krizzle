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
  ResetContainer,
  ResetButton,
  ResetButtonText,
} from "./ThemeSelector.styles";
import { useUserTheme } from "@/context/ThemeContext";

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
          <Card
            key={option}
            onPress={() => onSelect(option)}
            isSelected={selected === option}
          >
            <PreviewImage
              source={
                option === "system"
                  ? systemColorScheme === "light"
                    ? require("@/assets/images/theme-light.png")
                    : require("@/assets/images/theme-dark.png")
                  : option === "light"
                    ? require("@/assets/images/theme-light.png")
                    : require("@/assets/images/theme-dark.png")
              }
            />
            <LabelWrapper>
              <ThemedText fontSize="regular" fontWeight="regular">
                {option === "light"
                  ? "Light"
                  : option === "dark"
                    ? "Dark"
                    : "System Default"}
              </ThemedText>
              <RadioButtonOuter>
                {selected === option && <RadioButtonInner />}
              </RadioButtonOuter>
            </LabelWrapper>
          </Card>
        ))}
      </Container>

      {!isSystemSelected && (
        <ResetContainer>
          <ResetButton onPress={resetToSystemDefault}>
            <ResetButtonText>Reset to System Default</ResetButtonText>
          </ResetButton>
        </ResetContainer>
      )}
    </>
  );
};
