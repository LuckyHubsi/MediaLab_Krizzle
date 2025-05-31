import React, { useEffect, useState } from "react";
import { Modal, ScrollView, TouchableWithoutFeedback } from "react-native";
import {
  PopupBackdrop,
  PopupContainer,
  PopupText,
  CTAButton,
  CTAButtonText,
  ChevronButton,
  NavigationContainer,
  IndicatorText,
  RightChevronButton,
  LeftChevronButton,
  BottomContentContainer,
  TopContentContainer,
} from "./ErrorModal.styles";
import { ThemedText } from "@/components/ThemedText";
import { View } from "react-native";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { ServiceErrorType } from "@/shared/error/ServiceError";
import { HeaderRow } from "@/components/ui/TagPicker/TagPicker.styles";
import { MaterialIcons } from "@expo/vector-icons";

type EnrichedError = ServiceErrorType & { hasBeenRead: boolean; id: string };

interface ErrorPopupProps {
  visible: boolean;
  onClose: (updatedErrors: EnrichedError[]) => void;
  errors: EnrichedError[];
  ctaText?: string;
}

export const ErrorPopup: React.FC<ErrorPopupProps> = ({
  visible,
  onClose,
  errors,
  ctaText = "Got it",
}) => {
  const colorScheme = useActiveColorScheme();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= errors.length) {
      setIndex(0);
    }
  }, [errors]);

  if (!visible || !errors || errors.length === 0) return null;

  const current = errors[index];
  if (!current) return null;

  const getDefaultMessage = (type: ServiceErrorType["type"]) => {
    switch (type) {
      case "Validation Error":
        return "There was a problem with your input. Please check and try again.";
      case "No Connection":
        return "No internet connection. Please check your network and try again.";
      case "Retrieval Failed":
        return "Failed to retrieve data. Please try again later.";
      case "Not Found":
        return "The requested item was not found.";
      case "Creation Failed":
        return "Failed to create the item. Please try again.";
      case "Update Failed":
        return "Failed to update the item. Please try again.";
      case "Delete Failed":
        return "Failed to delete the item. Please try again.";
      case "Data Error":
        return "There was a problem with the data. Please try again.";
      case "Unknown Error":
      default:
        return "An unknown error occurred. Please try again.";
    }
  };

  const resolvedDescription =
    current.message || getDefaultMessage(current.type);

  const handleConfirm = () => {
    const updated = errors.map((err, i) =>
      i === index ? { ...err, hasBeenRead: true } : err,
    );
    onClose(updated); // Send updated errors back to HomeScreen
  };

  const goBack = () => setIndex((prev) => Math.max(0, prev - 1));
  const goNext = () =>
    setIndex((prev) => Math.min(errors.length - 1, prev + 1));

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={handleConfirm}>
        <PopupBackdrop>
          <TouchableWithoutFeedback onPress={() => {}}>
            <PopupContainer colorScheme={colorScheme}>
              <TopContentContainer>
                <HeaderRow>
                  <ThemedText fontSize="regular" fontWeight="bold">
                    {current.type}
                  </ThemedText>
                </HeaderRow>

                <PopupText>
                  <ThemedText fontSize="s" fontWeight="regular">
                    {resolvedDescription}
                  </ThemedText>
                </PopupText>
              </TopContentContainer>

              <BottomContentContainer>
                <NavigationContainer>
                  {index > 0 && (
                    <LeftChevronButton onPress={goBack}>
                      <MaterialIcons
                        name="chevron-left"
                        size={30}
                        color={colorScheme === "dark" ? "white" : "black"}
                      />
                    </LeftChevronButton>
                  )}
                  <IndicatorText colorScheme={colorScheme}>
                    {index + 1} of {errors.length}
                  </IndicatorText>
                  {index < errors.length - 1 && (
                    <RightChevronButton onPress={goNext}>
                      <MaterialIcons
                        name="chevron-right"
                        size={30}
                        color={colorScheme === "dark" ? "white" : "black"}
                      />
                    </RightChevronButton>
                  )}
                </NavigationContainer>
                <CTAButton
                  isRed
                  colorScheme={colorScheme}
                  onPress={handleConfirm}
                >
                  <CTAButtonText>Dismiss</CTAButtonText>
                </CTAButton>
              </BottomContentContainer>
            </PopupContainer>
          </TouchableWithoutFeedback>
        </PopupBackdrop>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
