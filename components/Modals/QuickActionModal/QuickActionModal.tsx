import React, { useEffect, useRef, useState } from "react";
import { Animated, Modal, Platform, TouchableOpacity } from "react-native";
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

/**
 * A modal component that displays a list of quick action items (e.g., edit, delete).
 *
 * @param {boolean} visible - Whether the modal is currently visible.
 * @param {() => void} onClose - Callback to close the modal.
 * @param {QuickActionItem[]} items - The list of actions to display in the modal.
 */

type QuickActionModalProps = {
  visible: boolean;
  onClose: () => void;
  items: QuickActionItem[];
};

/**
 * A single quick action item used in the QuickActionModal.
 *
 * @property {string} label - The display label for the action.
 * @property {keyof typeof MaterialIcons.glyphMap} icon - The MaterialIcon name.
 * @property {() => void} onPress - Function called when the item is pressed.
 * @property {boolean} [danger] - Marks the action as destructive.
 * @property {boolean} [disabled] - Disables the item.
 */

export type QuickActionItem = {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  danger?: boolean;
  disabled?: boolean;
};

export default function QuickActionModal({
  visible,
  onClose,
  items = [],
}: QuickActionModalProps) {
  const colorScheme = useActiveColorScheme() ?? "light";
  const [internalVisible, setInternalVisible] = useState(visible);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  /**
   * Effect to handle the visibility of the modal.
   */
  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  /**
   * Handles the fade-out animation and closes the modal.
   */
  const handleFadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setInternalVisible(false);
      onClose();
    });
  };

  /**
   * Returns null if the modal is not visible.
   */
  if (!internalVisible) return null;

  return (
    <Modal
      transparent
      animationType={Platform.OS === "ios" ? "fade" : "none"}
      visible={true}
      onRequestClose={handleFadeOut}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={handleFadeOut}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Close quick actions or move to next items to explore available actions."
        accessibilityHint="Closes the quick action menu when activated."
        importantForAccessibility="yes"
      >
        <Animated.View
          style={{
            flex: 1,
            opacity: Platform.OS === "android" ? fadeAnim : 1,
          }}
        >
          <ModalBackground>
            <TouchableOpacity activeOpacity={1}>
              <ModalBox
                colorScheme={colorScheme}
                accessibilityViewIsModal={true}
              >
                {items.map((item, index) => {
                  const textColorVariant = item.disabled
                    ? "disabled"
                    : item.danger
                      ? "red"
                      : "default";
                  const iconColor = item.disabled
                    ? Colors[colorScheme].disabled
                    : item.danger
                      ? Colors[colorScheme].negative
                      : Colors[colorScheme].text;

                  return (
                    <PopupItem
                      key={index}
                      onPress={() => {
                        if (!item.disabled) {
                          item.onPress?.();
                          handleFadeOut();
                        }
                      }}
                      colorScheme={colorScheme}
                      isLast={index === items.length - 1}
                      disabled={item.disabled}
                      accessibilityRole="button"
                      accessible={true}
                      accessibilityLabel={item.label}
                      accessibilityState={{ disabled: item.disabled }}
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
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}
