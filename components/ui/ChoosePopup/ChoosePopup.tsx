import React from "react";
import {
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import {
  Backdrop,
  Content,
  ItemCircle,
  ItemWrapper,
  DoneButton,
  DoneButtonText,
  ItemsGrid,
  ColorLabel,
} from "./ChoosePopup.styles";
import { ThemedText } from "@/components/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { useActiveColorScheme } from "@/context/ThemeContext";

/**
 * Component Popup for choosing a color or icon. (used in widget creation)
 * @param id (required) - Unique identifier for the item.
 * @param value (required) - The value of the item, can be a color string or an icon name.
 * @param label - Optional label for the item, used for colors.
 */

type PopupItem = {
  id: string;
  value: string | string[];
  label?: string;
};

interface ChoosePopupProps {
  visible: boolean;
  type: "color" | "icon";
  items: PopupItem[];
  selectedItem: string | null;
  onSelect: (item: string) => void;
  onClose: () => void;
  onDone: () => void;
}

export const ChoosePopup: React.FC<ChoosePopupProps> = ({
  visible,
  type,
  items,
  selectedItem,
  onSelect,
  onClose,
  onDone,
}) => {
  const colorScheme = useActiveColorScheme() ?? "light";

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose}>
        <Backdrop>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <Content colorScheme={colorScheme}>
                <ThemedText fontSize="regular" fontWeight="semibold">
                  {type === "color" ? "Choose a Color" : "Choose an Icon"}
                </ThemedText>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <ItemsGrid>
                    {items.map((item) => {
                      const isSelected =
                        selectedItem === item.value ||
                        (Array.isArray(item.value)
                          ? item.value[0] === selectedItem
                          : false);
                      const label = item.label || item.value;

                      return (
                        // Render each item in the grid
                        <ItemWrapper
                          key={item.id}
                          isSelected={isSelected}
                          colorScheme={colorScheme}
                          onPress={() => {
                            if (Array.isArray(item.value)) {
                              onSelect(item.value[0]);
                            } else {
                              onSelect(item.value);
                            }
                          }}
                        >
                          <ItemCircle
                            backgroundColor={type === "color" ? item.value : ""}
                            isSelected={isSelected}
                            colorScheme={colorScheme}
                            showBorder={type === "color"}
                          >
                            {/* Render color or icon based on type */}
                            {Array.isArray(item.value) ? (
                              <LinearGradient
                                colors={
                                  item.value as [string, string, ...string[]]
                                }
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: 12,
                                }}
                              />
                            ) : null}
                            {/* Render icon if type is "icon" */}
                            {type === "icon" && (
                              <MaterialIcons
                                name={item.value as any}
                                size={28}
                                color={
                                  isSelected ? "#fff" : Colors[colorScheme].text
                                }
                                accessibilityLabel={item.value as string}
                                accessibilityHint="Icon"
                                accessibilityRole="imagebutton"
                                accessibilityState={{
                                  selected: isSelected,
                                }}
                              />
                            )}
                          </ItemCircle>
                          {/* Render label for color items if type is "color" */}
                          {type === "color" && (
                            <ColorLabel>
                              {isSelected ? (
                                <ThemedText colorVariant="white">
                                  {label}
                                </ThemedText>
                              ) : (
                                <ThemedText>{label}</ThemedText>
                              )}
                            </ColorLabel>
                          )}
                        </ItemWrapper>
                      );
                    })}
                  </ItemsGrid>
                </ScrollView>
                <DoneButton onPress={() => onDone()}>
                  <ThemedText colorVariant="white" fontWeight="semibold">
                    Done
                  </ThemedText>
                </DoneButton>
              </Content>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Backdrop>
      </TouchableOpacity>
    </Modal>
  );
};
