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
  disabled?: boolean;
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
              {items.map((item, index) => {
                // Pre-calculate the correct colorVariant and icon color
                const textColorVariant = item.disabled
                  ? "disabled"
                  : item.danger
                    ? "red"
                    : "default";

                const iconColor = item.disabled
                  ? Colors[colorScheme].disabled
                  : item.danger
                    ? Colors.negative
                    : Colors[colorScheme].text;

                return (
                  <PopupItem
                    key={index}
                    onPress={() => {
                      if (!item.disabled) {
                        item.onPress?.();
                        onClose();
                      }
                    }}
                    colorScheme={colorScheme}
                    isLast={index === items.length - 1}
                    disabled={item.disabled}
                  >
                    <ThemedText
                      fontSize="regular"
                      fontWeight="regular"
                      colorVariant={textColorVariant}
                    >
                      {item.label}
                    </ThemedText>

                    <IconContainer>
                      <MaterialIcons
                        name={item.icon}
                        size={20}
                        color={iconColor}
                      />
                    </IconContainer>
                  </PopupItem>
                );
              })}
            </ModalBox>
          </TouchableOpacity>
        </ModalBackground>
      </TouchableOpacity>
    </Modal>
  );
}
