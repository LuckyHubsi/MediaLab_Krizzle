import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  FlatList,
  Modal,
  Animated,
  Dimensions,
  Easing,
  TouchableOpacity,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { MaterialIcons } from "@expo/vector-icons";
import { getPickerStyles } from "../CollectionListDropdown/CollectionListDropdown.styles";
import {
  AndroidPickerTouchable,
  ModalContent,
  OptionButton,
  ModalOverlay,
} from "./CustomPicker.styles";
import { ThemedText } from "@/components/ThemedText";
import { AccessibilityRole } from "react-native";

interface CustomPickerProps {
  value: string | number | null;
  onValueChange: (value: string | number) => void;
  items: { label: string; value: string | number }[];
  placeholder?: any;
  colorScheme: "light" | "dark";
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
  accessibilityLabelledBy?: string;
}

const CustomPicker: React.FC<CustomPickerProps> = ({
  value,
  onValueChange,
  items,
  placeholder,
  colorScheme,
  accessibilityRole,
  accessibilityLabel,
  accessibilityLabelledBy,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [shouldRenderSheet, setShouldRenderSheet] = useState(false);
  const slideAnim = useRef(
    new Animated.Value(Dimensions.get("window").height),
  ).current;

  const selectedLabel = items.find((i) => i.value === value)?.label;

  useEffect(() => {
    if (isModalVisible) {
      setShouldRenderSheet(true);
      slideAnim.setValue(Dimensions.get("window").height);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: Dimensions.get("window").height,
        duration: 400,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        setShouldRenderSheet(false);
      });
    }
  }, [isModalVisible]);

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get("window").height,
      duration: 400,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setIsModalVisible(false));
  };

  if (Platform.OS === "ios") {
    return (
      <RNPickerSelect
        value={value}
        onValueChange={onValueChange}
        items={items}
        style={getPickerStyles({ colorScheme })}
        placeholder={{}}
        Icon={() => (
          <MaterialIcons
            name="arrow-drop-down"
            size={30}
            color={colorScheme === "dark" ? "#fff" : "#000"}
          />
        )}
      />
    );
  }

  return (
    <>
      <AndroidPickerTouchable
        onPress={() => setIsModalVisible(true)}
        colorScheme={colorScheme}
        accessibilityRole={accessibilityRole ?? "combobox"}
        accessibilityLabel={accessibilityLabel ?? "Dropdown menu"}
        accessibilityHint={`Currently selected option ${selectedLabel}`}
        accessible={true}
        accessibilityLabelledBy={accessibilityLabelledBy}
        importantForAccessibility="yes"
      >
        <ThemedText fontSize="regular" fontWeight="regular" accessible={false}>
          {selectedLabel ?? "Select"}
        </ThemedText>
        <MaterialIcons
          name="arrow-drop-down"
          size={24}
          color={colorScheme === "dark" ? "#fff" : "#000"}
          accessible={false}
        />
      </AndroidPickerTouchable>

      <Modal transparent visible={isModalVisible} animationType="fade">
        <ModalOverlay>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={closeModal}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Close Dropdown"
            accessibilityHint="Dropdown currently opened. Close dropdown selection or move to next item to browse options."
            importantForAccessibility="yes"
          />

          {shouldRenderSheet && (
            <Animated.View
              style={{
                transform: [{ translateY: slideAnim }],
                backgroundColor: colorScheme === "dark" ? "#1c1c1e" : "#fff",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                overflow: "hidden",
              }}
            >
              <ModalContent colorScheme={colorScheme}>
                <TouchableOpacity
                  accessible={true}
                  accessibilityLabel=""
                  accessibilityRole="none"
                  style={{ height: 1, width: 1, opacity: 0 }}
                  importantForAccessibility="yes"
                />
                <FlatList
                  data={items}
                  keyExtractor={(item) => item.value.toString()}
                  renderItem={({ item }) => (
                    <OptionButton
                      onPress={() => {
                        onValueChange(item.value);
                        closeModal();
                      }}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={`Option for ${item.label}`}
                    >
                      <ThemedText fontSize="regular" fontWeight="regular">
                        {item.label}
                      </ThemedText>
                    </OptionButton>
                  )}
                />
              </ModalContent>
            </Animated.View>
          )}
        </ModalOverlay>
      </Modal>
    </>
  );
};

export default CustomPicker;
