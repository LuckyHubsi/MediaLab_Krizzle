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
  const [internalVisible, setInternalVisible] = useState(visible);
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
        accessible={false}
        importantForAccessibility="no"
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
                      ? Colors.negative
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
