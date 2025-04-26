import React, { FC } from "react";
import {
  BottomButtonContainer,
  DiscardButton,
  NextButton,
  StyledBottomButtons,
} from "./BottomButtons.styles";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";
import ProgressIndicator from "../CreateCollectionSteps/ProgressionIndicator/ProgressionIndicator";
import { Button } from "../Button/Button";

interface BottomButtonsProps {
  titleLeftButton: string;
  titleRightButton: string;
  onDiscard?: () => void;
  onNext: () => void;
  variant?: "discard" | "back";
  hasProgressIndicator?: boolean;
  progressStep?: number;
}

const BottomButtons: FC<BottomButtonsProps> = ({
  titleLeftButton,
  titleRightButton,
  onDiscard,
  onNext,
  variant,
  hasProgressIndicator = false,
  progressStep,
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const buttonTextVariants =
    variant === "discard" ? "red" : colorScheme === "dark" ? "white" : "grey";

  return (
    <StyledBottomButtons colorScheme={colorScheme}>
      {hasProgressIndicator && (
        <ProgressIndicator progressStep={progressStep || 0} />
      )}

      {progressStep && progressStep === 1 && (
        <Button onPress={onNext} children={"Next"} />
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
