import React, { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { Switch, TouchableOpacity, useColorScheme } from "react-native";
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
import { ColorSchemeOption } from "@/context/ThemeContext";
import { useUserTheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";

/**
 * Component for selecting a color scheme theme in the settings.
 *
 * @param selected (required) - The currently selected color scheme option.
 * @param onSelect (required) - Callback function to handle theme selection.
 */

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
  const [accessibleAnnouncement, setAccessibleAnnouncement] = useState("");

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
            accessible={true}
            accessibilityRole="radio"
            accessibilityLabel={`${option} mode option`}
            accessibilityState={{ selected: selected === option }}
            accessibilityHint={
              isSystemSelected && systemColorScheme === option
                ? `System Default is enabled and matches this theme option. Select ${option} mode to override the system default theme preference.`
                : `Select ${option} mode to override the system default theme preference.`
            }
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
        <ThemedText accessibilityRole="header">Use System Default</ThemedText>
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
          accessible={true}
          accessibilityRole="switch"
          accessibilityLabel="switch for using the system default theme preference"
          accessibilityHint={
            isSystemSelected
              ? `Turning the switch off will change the selected theme option to ${systemColorScheme === "light" ? "light mode" : "dark mode"} until changed.`
              : "Turning the switch on will reset your manually selected theme preference to use the system default."
          }
        />
      </ResetContainer>
    </>
  );
};
