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
  placeholder,
  colorScheme,
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
        Icon={() => <MaterialIcons name="arrow-drop-down" size={24} />}
      />
    );
  }

  return (
    <>
      <AndroidPickerTouchable
        onPress={() => setIsModalVisible(true)}
        colorScheme={colorScheme}
      >
        <ThemedText fontSize="regular" fontWeight="regular">
          {selectedLabel ?? "Select"}
        </ThemedText>
        <MaterialIcons name="arrow-drop-down" size={24} color="#888" />
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
                backgroundColor: colorScheme === "dark" ? "#1c1c1e" : "#fff",
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
