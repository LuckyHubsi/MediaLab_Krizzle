import { ThemedText } from "@/components/ThemedText";
import { FC, useEffect, useRef, useState } from "react";
import { useActiveColorScheme } from "@/context/ThemeContext";
import {
  ButtonContainer,
  CancelButton,
  FolderList,
  NextButton,
  StyledModalContent,
} from "./SelectFolderModal.styles";
import { Animated, Modal, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SelectFolderComponent from "./SelectFolderComponent/SelectFolderComponent";

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

  interface Folder {
    id: string;
    title: string;
    itemCount: number;
  }
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
    }
  }, [visible]);

  if (!internalVisible) return null;

  interface Folder {
    id: string;
    title: string;
    itemCount: number;
  }

  const hardcodedFolders: Folder[] = [
    { id: "1", title: "Folder 1", itemCount: 5 },
    { id: "2", title: "Folder 2", itemCount: 10 },
    { id: "3", title: "Folder 3", itemCount: 8 },
    { id: "4", title: "Folder 4", itemCount: 12 },
    { id: "5", title: "Folder 5", itemCount: 7 },
    { id: "6", title: "Folder 6", itemCount: 15 },
    { id: "7", title: "Folder 6", itemCount: 15 },
    { id: "8", title: "Folder 6", itemCount: 15 },
    { id: "9", title: "Folder jshdfkjsdjkfsdfhs6", itemCount: 15 },
    { id: "10", title: "Folder 6", itemCount: 15 },
    { id: "11", title: "Folder 6", itemCount: 15 },
    { id: "12", title: "Folder 6", itemCount: 15 },
    { id: "13", title: "Folder 6", itemCount: 15 },
    { id: "14", title: "Folder 6", itemCount: 15 },
    { id: "15", title: "Folder 6", itemCount: 15 },
  ];

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
            {selectedFolder && (
              <ThemedText colorVariant="primary" fontWeight="bold">
                {` *${selectedFolder.title}*`}
              </ThemedText>
            )}
          </ThemedText>

          <ScrollView>
            <FolderList>
              {hardcodedFolders.map((folder) => (
                <SelectFolderComponent
                  key={folder.id}
                  title={folder.title}
                  onPress={() => {
                    setSelectedFolder(folder);
                  }}
                />
              ))}
            </FolderList>
          </ScrollView>

          <ButtonContainer>
            <CancelButton
              onPress={() => {
                setInternalVisible(false);
                onClose();
              }}
              colorScheme={colorScheme}
            >
              <ThemedText colorVariant="cancel" fontWeight="bold">
                Cancel
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
