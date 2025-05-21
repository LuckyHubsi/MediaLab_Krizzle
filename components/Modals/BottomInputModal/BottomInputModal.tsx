import React from "react";
import {
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import { useActiveColorScheme } from "@/context/ThemeContext";
import {
  ModalOverlay,
  ModalContent,
  StyledTextInput,
} from "./BottomInputModal.styles";

type TagInputModalProps = {
  visible: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  placeholderText: string;
};

export const BottomInputModal: React.FC<TagInputModalProps> = ({
  visible,
  value,
  onChangeText,
  onSubmit,
  onClose,
  placeholderText,
}) => {
  const colorScheme = useActiveColorScheme() ?? "light";

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ModalOverlay activeOpacity={1} onPress={onClose}>
          <TouchableWithoutFeedback>
            <ModalContent colorScheme={colorScheme}>
              <StyledTextInput
                colorScheme={colorScheme}
                placeholder={placeholderText}
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChangeText}
                onSubmitEditing={onSubmit}
                textColor={Colors[colorScheme].text}
                autoFocus
              />
              <TouchableOpacity onPress={onSubmit}>
                <MaterialIcons
                  name="arrow-upward"
                  size={28}
                  color={Colors[colorScheme].text}
                />
              </TouchableOpacity>
            </ModalContent>
          </TouchableWithoutFeedback>
        </ModalOverlay>
      </KeyboardAvoidingView>
    </Modal>
  );
};
