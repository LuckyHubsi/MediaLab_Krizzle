import React from "react";
import { Modal, TouchableOpacity } from "react-native";
import {
  Overlay,
  BottomSheet,
  DragIndicator,
  OptionsRow,
  OptionButton,
  OptionIcon,
  OptionText,
} from "./CreateNCModal.styles";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedText } from "@/components/ThemedText";
import { useActiveColorScheme } from "@/context/ThemeContext";

type ModalSelectionProps = {
  isVisible: boolean;
  onClose: () => void;
};

export const ModalSelection: React.FC<ModalSelectionProps> = ({
  isVisible,
  onClose,
}) => {
  const colorScheme = useActiveColorScheme() ?? "light";
  const router = useRouter();

  return (
    <Modal transparent visible={isVisible} animationType="slide">
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose}>
        <Overlay>
          <BottomSheet colorScheme={colorScheme}>
            <DragIndicator />
            <OptionsRow>
              <OptionButton
                onPress={() => {
                  onClose();
                  router.push("/createNote");
                }}
                colorScheme={colorScheme}
              >
                <OptionIcon>
                  <MaterialIcons
                    name="sticky-note-2"
                    size={24}
                    color={Colors.primary}
                  />
                </OptionIcon>
                <OptionText>
                  <ThemedText fontSize="s" fontWeight="regular">
                    Create a{"\n"}note
                  </ThemedText>
                </OptionText>
              </OptionButton>

              <OptionButton
                onPress={() => {
                  onClose();
                  router.push("/createCollection");
                }}
                colorScheme={colorScheme}
              >
                <OptionIcon>
                  <MaterialIcons
                    name="collections-bookmark"
                    size={24}
                    color={Colors.primary}
                  />
                </OptionIcon>
                <OptionText>
                  <ThemedText fontSize="s" fontWeight="regular">
                    Create a{"\n"}collection
                  </ThemedText>
                </OptionText>
              </OptionButton>
            </OptionsRow>
          </BottomSheet>
        </Overlay>
      </TouchableOpacity>
    </Modal>
  );
};
