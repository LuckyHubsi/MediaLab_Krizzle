import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
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
  OptionsColumn,
} from "./CreateNCModal.styles";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedText } from "@/components/ThemedText";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { BottomInputModal } from "../BottomInputModal/BottomInputModal";
import { set } from "date-fns";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";
import { TagDTO } from "@/shared/dto/TagDTO";
import { FolderDTO } from "@/shared/dto/FolderDTO";
import { useServices } from "@/context/ServiceContext";

type ModalSelectionProps = {
  isVisible: boolean;
  onClose: () => void;
};

export const ModalSelection: React.FC<ModalSelectionProps> = ({
  isVisible,
  onClose,
}) => {
  const { folderService, tagService } = useServices();

  const colorScheme = useActiveColorScheme() ?? "light";
  const router = useRouter();

  const slideAnim = useRef(
    new Animated.Value(Dimensions.get("window").height),
  ).current;

  const { showSnackbar } = useSnackbar();

  const [shouldRenderSheet, setShouldRenderSheet] = React.useState(false);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const [isFolderModalVisible, setFolderModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [editMode, setEditMode] = useState(false);

  //TODO: use FolderDTO instead of TagDTO
  const [editingFolder, setEditingFolder] = useState<FolderDTO | null>(null);
  const [folders, setFolders] = useState<FolderDTO[]>([]);

  //TODO: Handle folder submit logic
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
        (!editMode || folder.folderID !== editingFolder?.folderID),
    );

    if (isDuplicate) {
      showSnackbar("A folder with this name already exists.", "top", "error");
      return;
    }

    try {
      let success = false;

      if (editMode && editingFolder) {
        //TODO: use updateFolder instead of updateTag
        success = await tagService.updateTag({
          ...editingFolder,
          //use folder_label instead of tag_label
          tag_label: trimmedFolder,
        });
      } else {
        const newFolderObject: FolderDTO = { folderName: trimmedFolder };
        success = await folderService.insertFolder(newFolderObject);
        if (success) {
          router.push("/folders?reload=1");
        }
      }

      if (success) setShouldRefetch(true);
    } catch (error) {
      console.error("Error saving folder:", error);
    } finally {
      setNewFolderName("");
      setEditingFolder(null);
      setEditMode(false);
      setFolderModalVisible(false);
      Keyboard.dismiss();
    }
  };

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
    <>
      <Modal transparent visible={isModalVisible}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        >
          <Overlay animationType="fade">
            {shouldRenderSheet && (
              <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
                <BottomSheet colorScheme={colorScheme}>
                  <DragIndicator />
                  <OptionsColumn>
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
                    <OptionsRow>
                      <OptionButton
                        onPress={() => {
                          setFolderModalVisible(true);
                          onClose();
                        }}
                        colorScheme={colorScheme}
                      >
                        <OptionIcon>
                          <MaterialIcons
                            name="folder"
                            size={24}
                            color={Colors.primary}
                          />
                        </OptionIcon>
                        <OptionText>
                          <ThemedText fontSize="s" fontWeight="regular">
                            Create a folder
                          </ThemedText>
                        </OptionText>
                      </OptionButton>
                    </OptionsRow>
                  </OptionsColumn>
                </BottomSheet>
              </Animated.View>
            )}
          </Overlay>
        </TouchableOpacity>
      </Modal>
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
