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
import { Colors } from "@/constants/Colors";

/**
 * Component for a custom picker that works on both Android and iOS.
 * It uses a modal for Android to display options in a bottom sheet style.
 * This component is designed to be used in a form where users can select from a list of items.
 * @param value (required) - The currently selected value.
 * @param onValueChange (required) - Callback function to handle value changes.
 * @param items (required) - An array of items to display in the picker, each with a label and value.
 * @param placeholder - Optional placeholder text for the picker.
 * @param colorScheme (required) - The color scheme of the app, either "light" or "dark".
 */

interface CustomPickerProps {
  value: string | number | null;
  onValueChange: (value: string | number) => void;
  items: { label: string; value: string | number }[];
  placeholder?: any;
  colorScheme: "light" | "dark";
}

const CustomPicker: React.FC<CustomPickerProps> = ({
  value,
  onValueChange,
  items,
  colorScheme,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [shouldRenderSheet, setShouldRenderSheet] = useState(false);
  const selectedLabel = items.find((i) => i.value === value)?.label;

  /**
   * Function to handle the slide animation for the modal.
   */
  const slideAnim = useRef(
    new Animated.Value(Dimensions.get("window").height),
  ).current;

  /**
   * Effect to handle the visibility of the modal and animate the slide in/out.
   * Animation from the bottom of the screen when the modal is opened.
   */
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

  /**
   * Function to close the modal and animate it sliding out.
   */
  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get("window").height,
      duration: 400,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => setIsModalVisible(false));
  };

  /*
   * Render the picker component based on the platform.
   * For iOS, it uses RNPickerSelect for a native picker.
   */
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
            color={Colors[colorScheme].text}
          />
        )}
      />
    );
  }

  /**
   * Render the custom Android picker component.
   */
  return (
    <>
      <AndroidPickerTouchable
        onPress={() => setIsModalVisible(true)}
        colorScheme={colorScheme}
      >
        <ThemedText fontSize="regular" fontWeight="regular">
          {selectedLabel ?? "Select"}
        </ThemedText>
        <MaterialIcons
          name="arrow-drop-down"
          size={24}
          color={Colors[colorScheme].text}
        />
      </AndroidPickerTouchable>

      <Modal transparent visible={isModalVisible} animationType="fade">
        <ModalOverlay>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={closeModal}
          />

          {shouldRenderSheet && (
            <Animated.View
              style={{
                transform: [{ translateY: slideAnim }],
                backgroundColor: Colors[colorScheme].text,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                overflow: "hidden",
              }}
            >
              <ModalContent colorScheme={colorScheme}>
                <FlatList
                  data={items}
                  keyExtractor={(item) => item.value.toString()}
                  renderItem={({ item }) => (
                    <OptionButton
                      onPress={() => {
                        onValueChange(item.value);
                        closeModal();
                      }}
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
