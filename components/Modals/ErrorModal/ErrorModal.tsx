import React, { useEffect, useState } from "react";
import { Modal, TouchableWithoutFeedback } from "react-native";
import {
  PopupBackdrop,
  PopupContainer,
  PopupText,
  CTAButton,
  CTAButtonText,
  NavigationContainer,
  IndicatorText,
  RightChevronButton,
  LeftChevronButton,
  BottomContentContainer,
  TopContentContainer,
} from "./ErrorModal.styles";
import { ThemedText } from "@/components/ThemedText";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { EnrichedError, ServiceErrorType } from "@/shared/error/ServiceError";
import { HeaderRow } from "@/components/ui/TagPicker/TagPicker.styles";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

/**
 * Component for displaying a popup with error messages.
 *
 * @param visible (required) - Whether the popup is visible.
 * @param onClose (required) - Callback function to handle closing the popup and updating errors.
 * @param errors (required) - Array of error objects to display.
 */

interface ErrorPopupProps {
  visible: boolean;
  onClose: (updatedErrors: EnrichedError[]) => void;
  errors: EnrichedError[];
}

export const ErrorPopup: React.FC<ErrorPopupProps> = ({
  visible,
  onClose,
  errors,
}) => {
  const colorScheme = useActiveColorScheme();
  const [index, setIndex] = useState(0);
  const current = errors[index];

  /**
   * Effect to reset the index if it exceeds the number of errors.
   */
  useEffect(() => {
    if (index >= errors.length) {
      setIndex(0);
    }
  }, [errors]);

  if (!visible || !errors || errors.length === 0) return null;

  if (!current) return null;

  /**
   * Function to get a default message based on the error type
   */
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

  /**
   * Resolve the description from the current error or use a default message
   */
  const resolvedDescription =
    current.message || getDefaultMessage(current.type);

  /**
   * If the error has a description, use it; otherwise, use the default message
   */
  const handleConfirm = () => {
    const updated = errors.map((err, i) =>
      i === index ? { ...err, hasBeenRead: true } : err,
    );
    onClose(updated); // Send updated errors back to HomeScreen
  };

  /**
   * Navigation functions to go back and next through the errors
   */
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
                    <LeftChevronButton
                      onPress={goBack}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel="Previous Error"
                    >
                      <MaterialIcons
                        name="chevron-left"
                        size={30}
                        color={
                          colorScheme === "dark" ? Colors.white : Colors.black
                        }
                      />
                    </LeftChevronButton>
                  )}
                  <IndicatorText
                    colorScheme={colorScheme}
                    accessibilityLabel={`Error ${index + 1} of ${errors.length}`}
                  >
                    {index + 1} of {errors.length}
                  </IndicatorText>
                  {index < errors.length - 1 && (
                    <RightChevronButton
                      onPress={goNext}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel="Next Error"
                    >
                      <MaterialIcons
                        name="chevron-right"
                        size={30}
                        color={
                          colorScheme === "dark" ? Colors.white : Colors.black
                        }
                      />
                    </RightChevronButton>
                  )}
                </NavigationContainer>
                <CTAButton
                  isRed
                  colorScheme={colorScheme}
                  onPress={handleConfirm}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Dismiss errors"
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
