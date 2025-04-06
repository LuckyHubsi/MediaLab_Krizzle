import React from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
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
import { ScrollView } from "react-native";
import { colorLabelMap } from "@/constants/LabelMaps";

interface ChoosePopupProps {
  visible: boolean;
  type: "color" | "icon";
  items: string[]; // List of color hexes or icon names
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
  const colorScheme = useColorScheme() ?? "light";

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
                <ScrollView>
                  <ItemsGrid>
                    {items.map((item) => {
                      const isSelected = selectedItem === item;
                      const label = colorLabelMap[item] || item;

                      return (
                        <ItemWrapper
                          key={item}
                          isSelected={isSelected}
                          onPress={() => onSelect(item)}
                        >
                          <ItemCircle
                            backgroundColor={
                              type === "color" ? item : "rgba(255,255,255,0.1)"
                            }
                          >
                            {type === "icon" && (
                              <MaterialIcons
                                name={item as any}
                                size={26}
                                color="#fff"
                              />
                            )}
                          </ItemCircle>
                          {type === "color" && <ColorLabel>{label}</ColorLabel>}
                        </ItemWrapper>
                      );
                    })}
                  </ItemsGrid>
                </ScrollView>
                <DoneButton onPress={onDone}>
                  <DoneButtonText colorScheme={colorScheme}>
                    Done
                  </DoneButtonText>
                </DoneButton>
              </Content>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </Backdrop>
      </TouchableOpacity>
    </Modal>
  );
};
