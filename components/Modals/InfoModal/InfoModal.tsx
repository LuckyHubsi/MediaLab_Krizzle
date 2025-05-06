import React from "react";
import { Modal, TouchableWithoutFeedback } from "react-native";
import {
  PopupBackdrop,
  PopupContainer,
  PopupText,
  PopupImage,
  CTAButton,
  CTAButtonText,
} from "./InfoModal.styles";
import { ThemedText } from "@/components/ThemedText";
import { View } from "react-native";
import { useActiveColorScheme } from "@/context/ThemeContext";

interface InfoPopupProps {
  visible: boolean;
  onClose: () => void;
  image: any;
  title: string;
  description: string;
  ctaText?: string;
  onConfirm?: () => void;
}

export const InfoPopup: React.FC<InfoPopupProps> = ({
  visible,
  onClose,
  image,
  title,
  description,
  ctaText = "Got it",
  onConfirm,
}) => {
  const colorScheme = useActiveColorScheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <PopupBackdrop>
          <PopupImage source={image} />
          <PopupContainer colorScheme={colorScheme}>
            <View style={{ marginBottom: 10 }}>
              <ThemedText fontSize="regular" fontWeight="bold">
                {title}
              </ThemedText>
            </View>
            <PopupText style={{ lineHeight: 20 }}>
              <ThemedText fontSize="s" fontWeight="regular">
                {description}
              </ThemedText>
            </PopupText>
            <CTAButton onPress={onConfirm || onClose}>
              <CTAButtonText>{ctaText}</CTAButtonText>
            </CTAButton>
          </PopupContainer>
        </PopupBackdrop>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
