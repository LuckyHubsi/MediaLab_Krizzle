import React from "react";
import { Modal, TouchableOpacity } from "react-native";
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
  typeToDelete: string;
  onCancel: () => void;
  onConfirm: () => void;
  onclose: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  title,
  typeToDelete,
  onCancel,
  onConfirm,
  onclose,
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
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onclose}>
        <Overlay>
          <ModalBox colorScheme={colorScheme}>
            <ThemedText fontSize="regular" fontWeight="semibold">
              Delete "{title}"?
            </ThemedText>
            <ThemedText fontSize="s" fontWeight="regular">
              Are you sure you want to delete this {typeToDelete}?
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
      </TouchableOpacity>
    </Modal>
  );
};

export default DeleteModal;
