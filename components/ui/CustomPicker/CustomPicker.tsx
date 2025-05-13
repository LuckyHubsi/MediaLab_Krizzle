import React, { useState } from "react";
import { Platform, FlatList } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { MaterialIcons } from "@expo/vector-icons";
import { getPickerStyles } from "../CollectionListDropdown/CollectionListDropdown.styles";
import {
  AndroidPickerTouchable,
  ModalContent,
  OptionButton,
} from "./CustomPicker.styles";
import { ThemedText } from "@/components/ThemedText";
import Modal from "react-native-modal";

interface CustomPickerProps {
  value: string | number | null;
  onValueChange: (value: string | number) => void;
  items: { label: string; value: string | number }[];
  placeholder?: { label: string; value: string | number };
  colorScheme: "light" | "dark";
}

const CustomPicker: React.FC<CustomPickerProps> = ({
  value,
  onValueChange,
  items,
  placeholder,
  colorScheme,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedLabel = items.find((i) => i.value === value)?.label;

  if (Platform.OS === "ios") {
    return (
      <RNPickerSelect
        value={value}
        onValueChange={onValueChange}
        items={items}
        style={getPickerStyles({ colorScheme })}
        placeholder={placeholder}
        Icon={() => <MaterialIcons name="arrow-drop-down" size={24} />}
      />
    );
  }

  return (
    <>
      <AndroidPickerTouchable
        onPress={() => setModalVisible(true)}
        colorScheme={colorScheme}
      >
        <ThemedText fontSize="regular" fontWeight="regular">
          {selectedLabel || placeholder?.label || "Select"}
        </ThemedText>
        <MaterialIcons name="arrow-drop-down" size={24} color="#888" />
      </AndroidPickerTouchable>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="down"
        backdropTransitionOutTiming={0}
        useNativeDriver={true}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={{ justifyContent: "flex-end", margin: 0 }}
      >
        <ModalContent colorScheme={colorScheme}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.value.toString()}
            renderItem={({ item }) => (
              <OptionButton
                onPress={() => {
                  onValueChange(item.value);
                  setModalVisible(false);
                }}
              >
                <ThemedText fontSize="regular" fontWeight="regular">
                  {item.label}
                </ThemedText>
              </OptionButton>
            )}
          />
        </ModalContent>
      </Modal>
    </>
  );
};

export default CustomPicker;
