import React from "react";
import { Modal, TouchableWithoutFeedback } from "react-native";
import {
  PopupBackdrop,
  PopupContainer,
  PopupText,
  CTAButton,
  CTAButtonText,
} from "./ErrorModal.styles";
import { ThemedText } from "@/components/ThemedText";
import { View } from "react-native";
import { useActiveColorScheme } from "@/context/ThemeContext";

interface ErrorPopupProps {
  visible: boolean;
  onClose: () => void;
  type: string;
  description?: string;
  ctaText?: string;
  onConfirm?: () => void;
}

export const ErrorPopup: React.FC<ErrorPopupProps> = ({
  visible,
  onClose,
  type,
  description,
  ctaText = "Got it",
  onConfirm,
}) => {
  const colorScheme = useActiveColorScheme();

  type ServiceError =
    | { type: "Validation Error"; message?: string }
    | { type: "No Connection"; message?: string }
    | { type: "Retrieval Failed"; message?: string }
    | { type: "Not Found"; message?: string }
    | { type: "Creation Failed"; message?: string }
    | { type: "Update Failed"; message?: string }
    | { type: "Delete Failed"; message?: string }
    | { type: "Data Error"; message?: string }
    | { type: "Unknown Error"; message?: string };

  // WONT BE NEEDED LATER ON
  const getDefaultMessage = (type: ServiceError["type"]) => {
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

  // TEST FUNCTIONS, IGNORE FOR NOW
  const handleValidationConfirm = () => {
    onClose();
  };
  const handleNoConnectionConfirm = () => {
    onClose();
  };
  const handleDefaultConfirm = () => {
    onClose();
  };

  const getAction = (type: ServiceError["type"], onClose: () => void) => {
    switch (type) {
      case "Validation Error":
        return handleValidationConfirm || onClose;
      case "No Connection":
        return handleNoConnectionConfirm || onClose;
      default:
        return handleDefaultConfirm || onClose;
    }
  };

  const resolvedDescription =
    description || getDefaultMessage(type as ServiceError["type"]);
  const resolvedAction = getAction(type as ServiceError["type"], onClose);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <PopupBackdrop>
          <PopupContainer colorScheme={colorScheme}>
            <View style={{ marginBottom: 10 }}>
              <ThemedText fontSize="regular" fontWeight="bold">
                {type}
              </ThemedText>
            </View>
            <PopupText style={{ lineHeight: 20 }}>
              <ThemedText fontSize="s" fontWeight="regular">
                {resolvedDescription}
              </ThemedText>
            </PopupText>
            <CTAButton onPress={resolvedAction}>
              <CTAButtonText>{ctaText}</CTAButtonText>
            </CTAButton>
          </PopupContainer>
        </PopupBackdrop>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
