import React, { FC } from "react";
import {
  BottomButtonContainer,
  DiscardButton,
  NextButton,
  StyledBottomButtons,
  StyledContainer,
} from "./BottomButtons.styles";
import { ThemedText } from "@/components/ThemedText";
import ProgressIndicator from "../CreateCollectionSteps/ProgressionIndicator/ProgressionIndicator";
import { Button } from "../Button/Button";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { useWindowDimensions } from "react-native";

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

  return (
    <LinearGradient
      colors={[
        Colors[colorScheme].background + "00", // transparent
        Colors[colorScheme].background + "B0", // semi-transparent
        Colors[colorScheme].background,
      ]}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: 40,
      }}
    >
      <StyledBottomButtons colorScheme={colorScheme}>
        {hasProgressIndicator && (
          <ProgressIndicator progressStep={progressStep || 0} />
        )}

        {progressStep && progressStep === 1 && (
          <Button onPress={onNext} children={singleButtonText} />
        )}

        {progressStep && progressStep > 1 && (
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
        )}
      </StyledBottomButtons>
    </LinearGradient>
  );
};

export default BottomButtons;
