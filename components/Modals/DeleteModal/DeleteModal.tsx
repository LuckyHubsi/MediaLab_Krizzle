import React from "react";
import { Modal, TouchableOpacity } from "react-native";
import {
  Overlay,
  ModalBox,
  ButtonRow,
  Action,
  ActionText,
  OverlayTextBox,
} from "./DeleteModal.styles";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { useActiveColorScheme } from "@/context/ThemeContext";

interface DeleteModalProps {
  visible: boolean;
  title?: string;
  onCancel: () => void;
  onConfirm: () => void;
  onclose: () => void;
  titleHasApostrophes?: boolean;
  extraInformation?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  title,
  onCancel,
  onConfirm,
  onclose,
  titleHasApostrophes = true,
  extraInformation,
}) => {
  const colorScheme = useActiveColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      accessibilityViewIsModal={true}
      accessible={true}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={onclose}
        accessible={false}
        importantForAccessibility="no"
        accessibilityElementsHidden={true}
      >
        <Overlay>
          <ModalBox colorScheme={colorScheme}>
            <OverlayTextBox>
              <ThemedText
                fontSize="regular"
                fontWeight="semibold"
                accessibilityRole="header"
                accessibilityLabel={`Delete confirmation for ${title}`}
              >
                {titleHasApostrophes
                  ? `Do you want to delete "${title}"?`
                  : `Do you want to delete ${title}?`}
              </ThemedText>
              {extraInformation && (
                <ThemedText fontSize="s" fontWeight="regular" textIsCentered>
                  {extraInformation}
                </ThemedText>
              )}
              <ThemedText fontSize="s" fontWeight="regular">
                You cannot undo this action
              </ThemedText>
            </OverlayTextBox>
            <ButtonRow>
              <Action
                onPress={onConfirm}
                colorScheme={colorScheme}
                accessibilityRole="button"
                accessibilityLabel="Confirm deletion"
                accessibilityHint="Deletes this item permanently"
              >
                <ThemedText colorVariant="red">Delete</ThemedText>
              </Action>
              <Action
                onPress={onCancel}
                colorScheme={colorScheme}
                accessibilityRole="button"
                accessibilityLabel="Cancel deletion"
                accessibilityHint="Closes the dialog without deleting"
              >
                <ThemedText colorVariant="primary">Cancel</ThemedText>
              </Action>
            </ButtonRow>
          </ModalBox>
        </Overlay>
      </TouchableOpacity>
    </Modal>
  );
};

export default DeleteModal;
