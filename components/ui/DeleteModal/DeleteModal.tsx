import React from "react";
import { Modal } from "react-native";
import {
  Overlay,
  ModalBox,
  ButtonRow,
  Action,
  ActionText,
} from "./DeleteModal.styles";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";

interface DeleteModalProps {
  visible: boolean;
  title?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  title,
  onCancel,
  onConfirm,
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Overlay>
        <ModalBox colorScheme={colorScheme}>
          <ThemedText fontSize="regular" fontWeight="semibold">
            Delete "{title}"?
          </ThemedText>
          <ThemedText fontSize="s" fontWeight="regular">
            Are you sure you want to delete this widget?
          </ThemedText>
          <ButtonRow>
            <Action onPress={onCancel}>
              <ActionText color={themeColors.icon}>Cancel</ActionText>
            </Action>
            <Action onPress={onConfirm}>
              <ActionText color="red">Delete</ActionText>
            </Action>
          </ButtonRow>
        </ModalBox>
      </Overlay>
    </Modal>
  );
};

export default DeleteModal;
