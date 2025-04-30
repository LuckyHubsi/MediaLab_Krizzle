import React, { useState } from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import {
  ModalBackground,
  ModalContainer,
  InputRow,
  StyledInput,
} from "./AddTagModal.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useActiveColorScheme } from "@/context/ThemeContext";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (tag: string) => void;
}

export const AddTagModal: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [input, setInput] = useState("");
  const colorScheme = useActiveColorScheme() ?? "light";

  const handleSubmit = () => {
    onSubmit(input.trim());
    setInput("");
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ModalBackground>
          <KeyboardAvoidingView behavior="padding">
            <ModalContainer colorScheme={colorScheme}>
              <InputRow>
                <StyledInput
                  value={input}
                  onChangeText={setInput}
                  placeholder="New tag..."
                  placeholderTextColor={
                    colorScheme === "light" ? "#999" : "#666"
                  }
                  onSubmitEditing={handleSubmit}
                  returnKeyType="done"
                  colorScheme={colorScheme}
                />
                <MaterialIcons
                  name="arrow-upward"
                  size={24}
                  color="#4A90E2"
                  onPress={handleSubmit}
                />
              </InputRow>
            </ModalContainer>
          </KeyboardAvoidingView>
        </ModalBackground>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
