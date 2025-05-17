import React, { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import {
  Switch,
  Touchable,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
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
import { Colors } from "@/constants/Colors";

type ThemeOption = "light" | "dark" | "system";

type ThemeSelectorProps = {
  selected: ThemeOption;
  onSelect: (theme: ThemeOption) => void;
};

export const ThemeSelector = ({ selected, onSelect }: ThemeSelectorProps) => {
  const systemColorScheme = useColorScheme() ?? "light";
  const { resetToSystemDefault } = useUserTheme();

  const [systemDefaultIsEnabled, setSystemDefaultIsEnabled] = useState(false);
  const isSystemSelected = selected === "system";

  const handleThemeSelect = (option: ThemeOption) => {
    onSelect(option);
    setSystemDefaultIsEnabled(false);
  };

  const toggleSwitch = () => {
    setSystemDefaultIsEnabled((prev) => {
      const newValue = !prev;
      if (newValue) {
        resetToSystemDefault();
      }
      return newValue;
    });
  };

  return (
    <>
      <Container>
        {(["light", "dark"] as ThemeOption[]).map((option) => (
          <TouchableOpacity
            onPress={() => handleThemeSelect(option)}
            key={option}
          >
            <ModeContainer>
              <Card
                onPress={() => handleThemeSelect(option)}
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
          <ThemedText>Use System Default</ThemedText>
          <Switch
            value={systemDefaultIsEnabled}
            onValueChange={toggleSwitch}
            trackColor={{
              false: Colors.grey50,
              true: Colors.primary,
            }}
            thumbColor={Colors.grey25}
            ios_backgroundColor="#3e3e3e"
            style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
          />
        </ResetContainer>
      )}
    </>
  );
};
