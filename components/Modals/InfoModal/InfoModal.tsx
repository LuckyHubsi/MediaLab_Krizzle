import React from "react";
import { Modal, ScrollView, TouchableWithoutFeedback } from "react-native";
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

/**
 * Component for displaying an informational popup with an image, title, description, and optional call-to-action button.
 *
 * @param visible (required) - Controls the visibility of the popup.
 * @param onClose (required) - Callback function to handle closing the popup.
 * @param image (required) - Image to display in the popup.
 * @param title (required) - Title of the popup.
 * @param description (required) - Description text to display in the popup.
 * @param ctaText - Text for the call-to-action button (default is "Got it").
 * @param onConfirm - Optional callback function to handle confirmation action when the button is pressed.
 */

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
      <PopupBackdrop>
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
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
        </ScrollView>
      </PopupBackdrop>
    </Modal>
  );
};
