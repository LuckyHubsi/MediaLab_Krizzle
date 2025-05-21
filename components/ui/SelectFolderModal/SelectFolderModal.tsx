import { ThemedText } from "@/components/ThemedText";
import { FC, useEffect, useRef, useState } from "react";
import { useActiveColorScheme } from "@/context/ThemeContext";
import {
  ButtonContainer,
  CancelButton,
  NextButton,
  StyledModalContent,
} from "./SelectFolderModal.styles";
import { Animated, Modal, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SelectFolderModalProps {
  visible: boolean;
  widgetTitle?: string;
  onClose: () => void;
}

const SelectFolderModal: FC<SelectFolderModalProps> = ({
  visible,
  widgetTitle,
  onClose,
}) => {
  const colorScheme = useActiveColorScheme();
  const [internalVisible, setInternalVisible] = useState(visible);

  const [selectedFolder, setSelectedFolder] = useState(null);
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

  if (!internalVisible) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <Modal
        transparent
        animationType="none"
        visible={true}
        onRequestClose={() => {
          setInternalVisible(false);
          onClose();
        }}
      >
        <StyledModalContent colorScheme={colorScheme}>
          <ThemedText>
            Move *{widgetTitle}* to
            {selectedFolder ? `*${selectedFolder}*` : null}
          </ThemedText>

          <ButtonContainer>
            <CancelButton
              onPress={() => {
                setInternalVisible(false);
                onClose();
              }}
              colorScheme={colorScheme}
            >
              <ThemedText colorVariant="cancel" fontWeight="bold">
                Back
              </ThemedText>
            </CancelButton>

            <NextButton onPress={() => {}} colorScheme={colorScheme}>
              <ThemedText colorVariant="white" fontWeight="bold">
                Move
              </ThemedText>
            </NextButton>
          </ButtonContainer>
        </StyledModalContent>
      </Modal>
    </SafeAreaView>
  );
};

export default SelectFolderModal;
