import React, { FC } from "react";
import {
  BottomButtonContainer,
  DiscardButton,
  NextButton,
} from "./BottomButtons.styles";
import { ThemedText } from "@/components/ThemedText";
import { useColorScheme } from "@/hooks/useColorScheme";

interface BottomButtonsProps {
  titleLeftButton: string;
  titleRightButton: string;
  onDiscard: () => void;
  onNext: () => void;
  variant?: "discard" | "back";
}

const BottomButtons: FC<BottomButtonsProps> = ({
  titleLeftButton,
  titleRightButton,
  onDiscard,
  onNext,
  variant,
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const buttonTextVariants =
    variant === "discard" ? "red" : colorScheme === "dark" ? "white" : "grey";

  return (
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
  );
};

export default BottomButtons;
