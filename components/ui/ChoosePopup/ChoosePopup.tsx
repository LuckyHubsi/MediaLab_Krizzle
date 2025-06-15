import React from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColorScheme } from "@/hooks/useColorScheme";
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
import { colorLabelMap } from "@/constants/LabelMaps";
import { LinearGradient } from "expo-linear-gradient";
import { useActiveColorScheme } from "@/context/ThemeContext";

type ColorKey = keyof typeof Colors.widget;

type PopupItem = {
  id: string;
  value: string | string[]; // support for gradient
  label?: string; // optional, for colors
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
                            {type === "icon" && (
                              <MaterialIcons
                                name={item.value as any}
                                size={28}
                                color={
                                  isSelected ? "#fff" : Colors[colorScheme].text
                                }
                              />
                            )}
                          </ItemCircle>
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
