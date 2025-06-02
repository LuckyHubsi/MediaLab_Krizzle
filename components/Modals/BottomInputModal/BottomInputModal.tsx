import React from "react";
import {
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { ModalContent, StyledTextInput } from "./BottomInputModal.styles";

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
        <TouchableWithoutFeedback onPress={onClose}>
          <LinearGradient
            colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.7)"]}
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
              padding: 20,
            }}
          >
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
                  maxLength={30}
                />
                <TouchableOpacity
                  onPress={onSubmit}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{
                    width: 50,
                    height: 50,
                    marginRight: -10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialIcons
                    name="arrow-upward"
                    size={24}
                    color={Colors[colorScheme].text}
                  />
                </TouchableOpacity>
              </ModalContent>
            </TouchableWithoutFeedback>
          </LinearGradient>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};
