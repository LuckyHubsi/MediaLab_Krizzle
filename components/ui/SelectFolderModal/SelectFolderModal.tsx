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
import { folderService } from "@/backend/service/FolderService";
import { FolderDTO } from "@/shared/dto/FolderDTO";

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
  const [folders, setFolders] = useState<Folder[]>([]);

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
      const fetchFolders = async () => {
        try {
          const data = await folderService.getAllFolders();

          const shapedFolders = mapToFolderShape(data);
          setFolders(shapedFolders);
        } catch (error) {
          console.error("Error loading folders:", error);
        }
      };

      fetchFolders();
    }
  }, [visible]);

  const mapToFolderShape = (data: FolderDTO[] | null): Folder[] => {
    if (data == null) {
      return [];
    } else {
      return (data || []).map((folder) => ({
        id: String(folder.folderID),
        title: folder.folderName,
        itemCount: folder.itemCount ?? 0,
      }));
    }
  };

  if (!internalVisible) return null;

  interface Folder {
    id: string;
    title: string;
    itemCount: number;
  }

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
            Move <ThemedText fontWeight="semibold">{widgetTitle}</ThemedText> to
            {selectedFolder && (
              <ThemedText colorVariant="primary" fontWeight="semibold">
                {` ${selectedFolder.title}`}
              </ThemedText>
            )}
          </ThemedText>

          <ScrollView>
            <FolderList>
              {folders.map((folder) => (
                <SelectFolderComponent
                  key={folder.id}
                  title={folder.title}
                  onPress={() => {
                    setSelectedFolder(folder);
                  }}
                  selected={selectedFolder?.id === folder.id}
                />
              ))}
            </FolderList>
          </ScrollView>

          <ButtonContainer>
            <CancelButton
              onPress={() => {
                setInternalVisible(false);
                setSelectedFolder(null);
                onClose();
              }}
              colorScheme={colorScheme}
            >
              <ThemedText colorVariant="cancel" fontWeight="bold">
                Cancel
              </ThemedText>
            </CancelButton>

            {/* TODO add move functionality */}
            <NextButton
              onPress={() => {}}
              colorScheme={colorScheme}
              selectedFolder={selectedFolder}
            >
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
