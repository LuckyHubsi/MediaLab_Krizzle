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

/**
 * Component for displaying a modal with a text input at the bottom of the screen.
 * It allows users to enter text and submit it, used for adding tags or folder names.
 *
 * @param visible (required) - Controls the visibility of the modal.
 * @param value (required) - The current text input value.
 * @param onChangeText (required) - Callback function to handle text changes.
 * @param onSubmit (required) - Callback function to handle submission of the text input.
 * @param onClose (required) - Callback function to close the modal.
 * @param placeholderText (required) - Placeholder text for the input field.
 */

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
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessible={true}
      accessibilityViewIsModal={true}
      accessibilityLabel="Input modal for adding a tag"
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <LinearGradient
          colors={["rgba(0,0,0,0.0)", "rgba(0,0,0,0.7)"]}
          style={{ flex: 1, justifyContent: "flex-end", padding: 20 }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "100%" }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
          >
            <TouchableWithoutFeedback>
              <ModalContent colorScheme={colorScheme}>
                <StyledTextInput
                  colorScheme={colorScheme}
                  placeholder={placeholderText}
                  placeholderTextColor={Colors[colorScheme].disabled}
                  value={value}
                  onChangeText={onChangeText}
                  onSubmitEditing={onSubmit}
                  textColor={Colors[colorScheme].text}
                  autoFocus
                  maxLength={30}
                  accessibilityHint="Enter or edit a name and press the arrow to submit"
                  accessible={true}
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
                  accessibilityRole="button"
                  accessibilityLabel="Submit"
                  accessibilityHint="Saves the new tag"
                >
                  <MaterialIcons
                    name="arrow-upward"
                    size={24}
                    accessible={false}
                    color={Colors[colorScheme].disabled}
                  />
                </TouchableOpacity>
              </ModalContent>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
