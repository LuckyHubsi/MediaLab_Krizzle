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
import {
  ColorSchemeOption,
  useActiveColorScheme,
} from "@/context/ThemeContext";
import { useUserTheme } from "@/context/ThemeContext";
import { Button } from "../Button/Button";
import { Colors } from "@/constants/Colors";

type ThemeSelectorProps = {
  selected: ColorSchemeOption;
  onSelect: (theme: ColorSchemeOption) => void;
};

export const ThemeSelector = ({ selected, onSelect }: ThemeSelectorProps) => {
  const systemColorScheme = useColorScheme() ?? "light";
  const { resetToSystemDefault, saveUserTheme, userTheme } = useUserTheme();

  const [systemDefaultIsEnabled, setSystemDefaultIsEnabled] = useState(false);
  const [lastManualTheme, setLastManualTheme] =
    useState<ColorSchemeOption>("light");

  const isSystemSelected = userTheme === "system";

  const handleThemeSelect = (option: ColorSchemeOption) => {
    onSelect(option);
    setSystemDefaultIsEnabled(false);
  };

  const toggleSwitch = () => {
    if (isSystemSelected) {
      saveUserTheme(lastManualTheme);
      onSelect(lastManualTheme);
    } else {
      resetToSystemDefault();
      onSelect("system");
    }
  };

  return (
    <>
      <Container>
        {(["light", "dark"] as ColorSchemeOption[]).map((option) => (
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

      <ResetContainer>
        <ThemedText>Use System Default</ThemedText>
        <Switch
          value={isSystemSelected}
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
    </>
  );
};
