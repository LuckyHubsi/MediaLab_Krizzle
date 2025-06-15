import React from "react";
import { Modal, TouchableOpacity } from "react-native";
import {
  Overlay,
  ModalBox,
  ButtonRow,
  Action,
  OverlayTextBox,
} from "./DeleteModal.styles";
import { ThemedText } from "@/components/ThemedText";
import { useActiveColorScheme } from "@/context/ThemeContext";

/**
 * Component for rendering a modal that confirms deletion of an item.
 *
 * @param visible (required) - Controls the visibility of the modal.
 * @param title - The title of the item to be deleted.
 * @param onCancel (required) - Callback function to handle cancellation of the deletion.
 * @param onConfirm (required) - Callback function to handle confirmation of the deletion.
 * @param onClose (required) - Callback function to close the modal.
 * @param titleHasApostrophes - Flag to determine if the title has apostrophes.
 * @param extraInformation - Additional information to display in the modal.
 */

interface DeleteModalProps {
  visible: boolean;
  title?: string;
  onCancel: () => void;
  onConfirm: () => void;
  onClose: () => void;
  titleHasApostrophes?: boolean;
  extraInformation?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  title,
  onCancel,
  onConfirm,
  onClose,
  titleHasApostrophes = true,
  extraInformation,
}) => {
  const colorScheme = useActiveColorScheme() ?? "light";

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
                textIsCentered
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
              <ThemedText fontSize="s" fontWeight="regular" textIsCentered>
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
