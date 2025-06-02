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
import { useWindowDimensions, Animated, Easing, View } from "react-native";

interface BottomButtonsProps {
  titleLeftButton?: string;
  titleRightButton?: string;
  singleButtonText?: string;
  onDiscard?: () => void;
  onNext: () => void;
  variant?: "discard" | "back";
  hasProgressIndicator?: boolean;
  progressStep?: number;
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
}) => {
  const colorScheme = useActiveColorScheme() ?? "light";
  const window = useWindowDimensions();
  const buttonTextVariants =
    variant === "discard" ? "red" : colorScheme === "dark" ? "white" : "grey";

  const singleButtonOpacity = useRef(new Animated.Value(1)).current;
  const dualButtonsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
  }, [progressStep]);

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
