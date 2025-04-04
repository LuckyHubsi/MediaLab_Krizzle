import React from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  PopupTitle,
  ItemsGrid,
  ColorLabel,
} from "./ChoosePopup.styles";
import { ThemedText } from "@/components/ThemedText";
import { ScrollView } from "react-native";

// TESTING MAP FOR LABELS TO COLORS
const colorNameMap: Record<string, string> = {
  "#ffffff": "White",
  "#111111": "Black",
  "#585858": "Grey",
  "#ABABAB": "Light Grey",
  "#82A9CC": "Blue Grey",
  "#7DB5EA": "Light Blue",
  "#4599E8": "Blue",
  "#1D7ED7": "Dark Blue",
  "#6D2EFF": "Purple",
  "#8559ED": "Violet",
  "#D50BBA": "Pink",
  "#ED59C8": "Rose",
  "#E71341": "Dark Red",
  "#FF5667": "Red",
  "#118845": "Green",
  "#49976B": "Sage",
};

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
            style={{ flex: 1 }}
          >
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <Content colorScheme={colorScheme}>
                <PopupTitle>
                  {type === "color" ? "Choose a Color" : "Choose an Icon"}
                </PopupTitle>
                <ScrollView>
                  <ItemsGrid>
                    {items.map((item) => {
                      const isSelected = selectedItem === item;
                      const label = colorNameMap[item] || item;

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
                              <Ionicons
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
