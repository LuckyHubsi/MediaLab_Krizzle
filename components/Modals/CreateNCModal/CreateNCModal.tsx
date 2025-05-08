import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  TouchableOpacity,
} from "react-native";
import {
  Overlay,
  BottomSheet,
  DragIndicator,
  OptionsRow,
  OptionButton,
  OptionIcon,
  OptionText,
} from "./CreateNCModal.styles";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedText } from "@/components/ThemedText";
import { useActiveColorScheme } from "@/context/ThemeContext";

type ModalSelectionProps = {
  isVisible: boolean;
  onClose: () => void;
};

export const ModalSelection: React.FC<ModalSelectionProps> = ({
  isVisible,
  onClose,
}) => {
  const colorScheme = useActiveColorScheme() ?? "light";
  const router = useRouter();

  const slideAnim = useRef(
    new Animated.Value(Dimensions.get("window").height),
  ).current;

  const [shouldRenderSheet, setShouldRenderSheet] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsModalVisible(true);
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
        setIsModalVisible(false);
      });
    }
  }, [isVisible]);

  return (
    <Modal transparent visible={isModalVisible}>
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose}>
        <Overlay animationType="fade">
          {shouldRenderSheet && (
            <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
              <BottomSheet colorScheme={colorScheme}>
                <DragIndicator />
                <OptionsRow>
                  <OptionButton
                    onPress={() => {
                      onClose();
                      router.push("/createNote");
                    }}
                    colorScheme={colorScheme}
                  >
                    <OptionIcon>
                      <MaterialIcons
                        name="sticky-note-2"
                        size={24}
                        color={Colors.primary}
                      />
                    </OptionIcon>
                    <OptionText>
                      <ThemedText fontSize="s" fontWeight="regular">
                        Create a{"\n"}note
                      </ThemedText>
                    </OptionText>
                  </OptionButton>

                  <OptionButton
                    onPress={() => {
                      onClose();
                      router.push("/createCollection");
                    }}
                    colorScheme={colorScheme}
                  >
                    <OptionIcon>
                      <MaterialIcons
                        name="collections-bookmark"
                        size={24}
                        color={Colors.primary}
                      />
                    </OptionIcon>
                    <OptionText>
                      <ThemedText fontSize="s" fontWeight="regular">
                        Create a{"\n"}collection
                      </ThemedText>
                    </OptionText>
                  </OptionButton>
                </OptionsRow>
              </BottomSheet>
            </Animated.View>
          )}
        </Overlay>
      </TouchableOpacity>
    </Modal>
  );
};
