import React, { FC, useEffect, useRef } from "react";
import {
  BottomButtonContainer,
  DiscardButton,
  NextButton,
  StyledBottomButtons,
} from "./BottomButtons.styles";
import { ThemedText } from "@/components/ThemedText";
import ProgressIndicator from "../CreateCollectionSteps/ProgressionIndicator/ProgressionIndicator";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { Animated, View } from "react-native";

/** Component for two or one buttons at the bottom of the screen.
 * It can be used in the note/creation/onboarding process to navigate between steps.
 * @param titleLeftButton - The title of the left button.
 * @param titleRightButton - The title of the right button.
 * @param singleButtonText - The text for the single button when only one is displayed.
 * @param onDiscard - Callback function for the left button (discard).
 * @param onNext - Callback function for the right button (next).
 * @param variant - The variant of the buttons, can be "discard" or "back" (different styling).
 * @param hasProgressIndicator - Whether to show a progress indicator above the buttons.
 * @param progressStep - The current step in the progress indicator.
 * @param enableAnimation - Whether to enable the animation for button transitions.
 **/

interface BottomButtonsProps {
  titleLeftButton?: string;
  titleRightButton?: string;
  singleButtonText?: string;
  onDiscard?: () => void;
  onNext: () => void;
  variant?: "discard" | "back";
  hasProgressIndicator?: boolean;
  progressStep?: number;
  enableAnimation?: boolean;
}

const BottomButtons: FC<BottomButtonsProps> = ({
  titleLeftButton,
  titleRightButton,
  singleButtonText,
  onDiscard,
  onNext,
  variant,
  hasProgressIndicator = false,
  progressStep,
  enableAnimation = false,
}) => {
  const colorScheme = useActiveColorScheme() ?? "light";
  const buttonTextVariants =
    variant === "discard" ? "red" : colorScheme === "dark" ? "white" : "grey";

  const singleButtonOpacity = useRef(new Animated.Value(1)).current;
  const dualButtonsOpacity = useRef(new Animated.Value(0)).current;

  /**
   * Effect to control fade-in/fade-out animations when switching
   * between a single button (for progressStep === 1) and dual buttons (for all other steps).
   */
  useEffect(() => {
    if (!enableAnimation) {
      singleButtonOpacity.setValue(progressStep === 1 ? 1 : 0);
      dualButtonsOpacity.setValue(progressStep === 1 ? 0 : 1);
      return;
    }

    if (progressStep === 1) {
      Animated.parallel([
        Animated.timing(singleButtonOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(dualButtonsOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(singleButtonOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dualButtonsOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [progressStep, enableAnimation]);

  return (
    <LinearGradient
      colors={[
        Colors[colorScheme].background + "00",
        Colors[colorScheme].background + "B0",
        Colors[colorScheme].background + "FF",
      ]}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: 35,
      }}
    >
      <StyledBottomButtons colorScheme={colorScheme}>
        {hasProgressIndicator && (
          <ProgressIndicator progressStep={progressStep || 0} />
        )}

        <View style={{ position: "relative", height: 64 }}>
          <Animated.View
            style={{
              position: "absolute",
              width: "100%",
              opacity: singleButtonOpacity,
            }}
            pointerEvents={progressStep === 1 ? "auto" : "none"}
          >
            <NextButton onPress={onNext}>
              <ThemedText colorVariant="white" fontWeight="bold">
                {singleButtonText || "Next"}
              </ThemedText>
            </NextButton>
          </Animated.View>
          <Animated.View
            style={{
              position: "absolute",
              width: "100%",
              opacity: dualButtonsOpacity,
            }}
            pointerEvents={progressStep === 1 ? "none" : "auto"}
          >
            <BottomButtonContainer>
              <DiscardButton
                onPress={onDiscard}
                colorScheme={colorScheme}
                variant={variant ?? "discard"}
              >
                <ThemedText colorVariant={buttonTextVariants} fontWeight="bold">
                  {titleLeftButton}
                </ThemedText>
              </DiscardButton>

              <NextButton onPress={onNext}>
                <ThemedText colorVariant="white" fontWeight="bold">
                  {titleRightButton}
                </ThemedText>
              </NextButton>
            </BottomButtonContainer>
          </Animated.View>
        </View>
      </StyledBottomButtons>
    </LinearGradient>
  );
};

export default BottomButtons;
