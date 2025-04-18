// components/ui/DeleteModal/DeleteModal.tsx

import React from "react";
import { Modal } from "react-native";
import {
  Overlay,
  ModalBox,
  Title,
  Message,
  ButtonRow,
  Action,
  ActionText,
} from "./DeleteModal.styles";

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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Overlay>
        <ModalBox>
          <Title>Delete "{title}"?</Title>
          <Message>Are you sure you want to delete this widget?</Message>
          <ButtonRow>
            <Action onPress={onCancel}>
              <ActionText color="#888">Cancel</ActionText>
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
