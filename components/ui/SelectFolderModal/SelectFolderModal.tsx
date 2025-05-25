import { ThemedText } from "@/components/ThemedText";
import { FC, useEffect, useRef, useState } from "react";
import { useActiveColorScheme } from "@/context/ThemeContext";
import {
  ButtonContainer,
  CancelButton,
  FolderList,
  NextButton,
  StyledAddFolderButton,
  StyledModalContent,
} from "./SelectFolderModal.styles";
import {
  Animated,
  Dimensions,
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SelectFolderComponent from "./SelectFolderComponent/SelectFolderComponent";
import { FlatList } from "react-native";
import { Button } from "../Button/Button";
import { BottomInputModal } from "@/components/Modals/BottomInputModal/BottomInputModal";
import { useSnackbar } from "../Snackbar/Snackbar";
import { TagDTO } from "@/shared/dto/TagDTO";
import { FolderDTO } from "@/shared/dto/FolderDTO";
import { FloatingAddButton } from "../NavBar/FloatingAddButton/FloatingAddButton";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useServices } from "@/context/ServiceContext";

interface SelectFolderModalProps {
  visible: boolean;
  widgetTitle?: string;
  widgetId?: string;
  onClose: () => void;
}

const SelectFolderModal: FC<SelectFolderModalProps> = ({
  visible,
  widgetTitle,
  widgetId,
  onClose,
}) => {
  const colorScheme = useActiveColorScheme();
  const [internalVisible, setInternalVisible] = useState(visible);
  const [isFolderModalVisible, setFolderModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editFolderMode, setEditFolderMode] = useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [editingFolder, setEditingFolder] = useState<FolderDTO | null>(null);
  const [folders, setFolders] = useState<FolderDTO[]>([]);

  const { generalPageService, tagService, folderService } = useServices();
  const { showSnackbar } = useSnackbar();

  const handleFolderSubmit = async () => {
    const trimmedFolder = newFolderName.trim();

    if (!trimmedFolder) return;

    if (trimmedFolder.length > 30) {
      showSnackbar(
        "Folder name must be less than 30 characters.",
        "top",
        "error",
      );
      return;
    }

    //TODO: use folderId instead of tagID
    const isDuplicate = folders.some(
      (folder) =>
        folder.folderName === trimmedFolder &&
        (!editFolderMode || folder.folderID !== editingFolder?.folderID),
    );

    if (isDuplicate) {
      showSnackbar("A folder with this name already exists.", "top", "error");
      return;
    }

    try {
      let success = false;

      if (editFolderMode && editingFolder) {
        const result = await folderService.updateFolder({
          ...editingFolder,
          folderName: trimmedFolder,
        });
        if (result.success) {
          success = true;
        } else {
          // TODO: show error modal
          success = false;
        }
      } else {
        const newFolderObject: FolderDTO = { folderName: trimmedFolder };
        const result = await folderService.insertFolder(newFolderObject);
        if (result.success) {
          success = true;
        } else {
          // TODO: show error modal
        }
      }

      if (success && !editFolderMode) {
        const result = await folderService.getAllFolders();
        if (result.success) {
          const updatedFolders = result.value;
          setFolders(updatedFolders ?? []);
          const newFolder = updatedFolders.find(
            (f) => f.folderName === trimmedFolder,
          );
          if (newFolder) {
            setSelectedFolder({
              id: String(newFolder.folderID),
              title: newFolder.folderName,
              itemCount: newFolder.itemCount ?? 0,
            });
          }
        } else {
          // TODO: show error modal
          console.log(result.error.type);
          console.log(result.error.message);
        }
      } else if (success && editFolderMode) {
        setShouldRefetch(true);
      }
    } catch (error) {
      console.error("Error saving folder:", error);
    } finally {
      setNewFolderName("");
      setEditingFolder(null);
      setEditFolderMode(false);
      setFolderModalVisible(false);
      Keyboard.dismiss();
    }
  };

  interface Folder {
    id: string;
    title: string;
    itemCount: number;
  }
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);
      const fetchFolders = async () => {
        try {
          const result = await folderService.getAllFolders();
          if (result.success) {
            setFolders(result.value);
          } else {
            // TODO: show error modal
          }
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

  useEffect(() => {
    if (visible || shouldRefetch) {
      setInternalVisible(true);

      const fetchFolders = async () => {
        try {
          const result = await folderService.getAllFolders();
          if (result.success) {
            setFolders(result.value);
          } else {
            // TODO: show error modal
          }
        } catch (error) {
          console.error("Error loading folders:", error);
        } finally {
          if (shouldRefetch) {
            setShouldRefetch(false);
          }
        }
      };

      fetchFolders();
    }
  }, [visible, shouldRefetch]);

  const folderItems = [
    ...mapToFolderShape(folders),
    {
      id: "add-folder-button",
      title: "Add Folder",
      isAddButton: true,
    },
  ];

  const modalPadding = 30;
  const numColumns = 3;
  const screenWidth = Dimensions.get("window").width - modalPadding;
  const itemMargin = 10;
  const itemSize = (screenWidth - itemMargin * (numColumns + 1)) / numColumns;

  if (!internalVisible) return null;

  return (
    <>
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
          <StyledModalContent
            colorScheme={colorScheme}
            modalPadding={modalPadding}
          >
            {folders.length !== 0 ? (
              <ThemedText>
                Move
                <ThemedText fontWeight="semibold">{widgetTitle}</ThemedText> to
                {selectedFolder && (
                  <ThemedText colorVariant="primary" fontWeight="semibold">
                    {` ${selectedFolder.title}`}
                  </ThemedText>
                )}
              </ThemedText>
            ) : (
              <ThemedText>You don't have any Folders yet.</ThemedText>
            )}

            {folders.length !== 0 && (
              <>
                <FlatList
                  data={folderItems}
                  numColumns={numColumns}
                  keyExtractor={(item) => item.id}
                  columnWrapperStyle={{
                    justifyContent: "flex-start",
                    marginBottom: itemMargin,
                  }}
                  contentContainerStyle={{ paddingHorizontal: itemMargin }}
                  renderItem={({ item }) => {
                    if ("isAddButton" in item && item.isAddButton) {
                      return (
                        <TouchableOpacity
                          onPress={() => setFolderModalVisible(true)}
                          style={{
                            width: itemSize,
                            alignItems: "center",
                            marginBottom: itemMargin,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: Colors.primary,
                              borderRadius: itemSize / 2,
                              width: 50,
                              height: 50,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <MaterialIcons name="add" size={30} color="white" />
                          </View>
                          <ThemedText>Add Folder</ThemedText>
                        </TouchableOpacity>
                      );
                    }

                    return (
                      <SelectFolderComponent
                        itemSize={itemSize}
                        key={item.id}
                        title={item.title}
                        onPress={() => {
                          if ("itemCount" in item) {
                            setSelectedFolder(item);
                          }
                        }}
                        selected={selectedFolder?.id === item.id}
                      />
                    );
                  }}
                />
              </>
            )}

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
              {folders.length !== 0 ? (
                <NextButton
                  onPress={async () => {
                    const result = await generalPageService.updateFolderID(
                      Number(widgetId),
                      Number(selectedFolder?.id),
                    );
                    if (result.success) {
                      setInternalVisible(false);
                      setSelectedFolder(null);
                      onClose();
                    } else {
                      // TODO: show error modal
                      console.log(result.error.type);
                      console.log(result.error.message);
                    }
                  }}
                  colorScheme={colorScheme}
                  selectedFolder={selectedFolder}
                >
                  <ThemedText colorVariant="white" fontWeight="bold">
                    Move
                  </ThemedText>
                </NextButton>
              ) : (
                <NextButton
                  onPress={() => {
                    setFolderModalVisible(true);
                  }}
                  colorScheme={colorScheme}
                  selectedFolder={true}
                >
                  <ThemedText colorVariant="white" fontWeight="bold">
                    Add Folder
                  </ThemedText>
                </NextButton>
              )}
            </ButtonContainer>
          </StyledModalContent>
        </Modal>
      </SafeAreaView>
      <BottomInputModal
        visible={isFolderModalVisible}
        value={newFolderName}
        onChangeText={setNewFolderName}
        onSubmit={handleFolderSubmit}
        onClose={() => {
          Keyboard.dismiss();
          setFolderModalVisible(false);
        }}
        placeholderText="Enter a new folder name"
      />
    </>
  );
};

export default SelectFolderModal;
