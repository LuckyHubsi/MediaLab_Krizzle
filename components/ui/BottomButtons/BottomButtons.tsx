import React, { FC } from "react";
import {
  BottomButtonContainer,
  DiscardButton,
  NextButton,
  StyledBottomButtons,
} from "./BottomButtons.styles";
import { ThemedText } from "@/components/ThemedText";
import ProgressIndicator from "../CreateCollectionSteps/ProgressionIndicator/ProgressionIndicator";
import { Button } from "../Button/Button";
import { useActiveColorScheme } from "@/context/ThemeContext";

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
  const buttonTextVariants =
    variant === "discard" ? "red" : colorScheme === "dark" ? "white" : "grey";

  return (
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
  );
};

export default BottomButtons;
