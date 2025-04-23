import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { styles } from "./ModalSelection.styles";

type ModalSelectionProps = {
  isVisible: boolean;
  onClose: () => void;
};

export const ModalSelection: React.FC<ModalSelectionProps> = ({
  isVisible,
  onClose,
}) => {
  const router = useRouter();

  return (
    <Modal transparent visible={isVisible} animationType="slide">
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            onPress={() => {
              onClose();
              router.push("/createNote");
            }}
          >
            <Text style={styles.modalOption}>Note</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onClose();
              router.push("/createCollection");
            }}
          >
            <Text style={styles.modalOption}>Collection</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
