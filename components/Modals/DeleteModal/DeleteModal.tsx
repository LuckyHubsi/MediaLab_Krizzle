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
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  visible,
  title,
  onCancel,
  onConfirm,
  onclose,
  titleHasApostrophes = true,
}) => {
  const colorScheme = useActiveColorScheme() ?? "light";
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
            <OverlayTextBox>
              <ThemedText fontSize="regular" fontWeight="semibold">
                {titleHasApostrophes
                  ? `Do you want to delete "${title}"?`
                  : `Do you want to delete ${title}?`}
              </ThemedText>
              <ThemedText fontSize="s" fontWeight="regular">
                You cannot undo this action
              </ThemedText>
            </OverlayTextBox>
            <ButtonRow>
              <Action onPress={onConfirm} colorScheme={colorScheme}>
                <ActionText color="red">Delete</ActionText>
              </Action>
              <Action onPress={onCancel} colorScheme={colorScheme}>
                <ActionText color="#4599E8">Cancel</ActionText>
              </Action>
            </ButtonRow>
          </ModalBox>
        </Overlay>
      </TouchableOpacity>
    </Modal>
  );
};

export default DeleteModal;
