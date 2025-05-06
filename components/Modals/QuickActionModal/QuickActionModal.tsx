import React from "react";
import { Modal, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  ModalBackground,
  ModalBox,
  PopupItem,
  IconContainer,
} from "./QuickActionModal.styles";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";

export type QuickActionItem = {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  danger?: boolean;
};

type QuickActionModalProps = {
  visible: boolean;
  onClose: () => void;
  items: QuickActionItem[];
};

export default function QuickActionModal({
  visible,
  onClose,
  items = [],
}: QuickActionModalProps) {
  const colorScheme = useActiveColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={{ flex: 1 }} onPress={onClose}>
        <ModalBackground>
          <TouchableOpacity activeOpacity={1}>
            <ModalBox colorScheme={colorScheme}>
              {items.map((item, index) => (
                <PopupItem
                  key={index}
                  onPress={() => {
                    item.onPress?.();
                    onClose();
                  }}
                  colorScheme={colorScheme}
                  isLast={index === items.length - 1}
                >
                  <ThemedText
                    fontSize="regular"
                    fontWeight="regular"
                    colorVariant={item.danger ? "red" : "default"}
                  >
                    {item.label}
                  </ThemedText>
                  <IconContainer>
                    <MaterialIcons
                      name={item.icon}
                      size={20}
                      color={item.danger ? Colors.negative : themeColors.icon}
                    />
                  </IconContainer>
                </PopupItem>
              ))}
            </ModalBox>
          </TouchableOpacity>
        </ModalBackground>
      </TouchableOpacity>
    </Modal>
  );
}
