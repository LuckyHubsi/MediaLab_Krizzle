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
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";
import { FolderDTO } from "@/shared/dto/FolderDTO";
import { useServices } from "@/context/ServiceContext";
import { ErrorPopup } from "../ErrorModal/ErrorModal";
import { EnrichedError } from "@/shared/error/ServiceError";

/**
 * Component for displaying a modal selection sheet with options to create notes, collections, or folders.
 *
 * @param isVisible (required) - Controls the visibility of the modal.
 * @param onClose (required) - Callback function to handle closing the modal.
 */

type ModalSelectionProps = {
  isVisible: boolean;
  onClose: () => void;
};

export const ModalSelection: React.FC<ModalSelectionProps> = ({
  isVisible,
  onClose,
}) => {
  const { folderService } = useServices();
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
  const [editingFolder, setEditingFolder] = useState<FolderDTO | null>(null);
  const [folders, setFolders] = useState<FolderDTO[]>([]);
  const [errors, setErrors] = useState<EnrichedError[]>([]);
  const [showError, setShowError] = useState(false);

  /**
   * Handles the submission of a new folder name.
   */
  const handleFolderSubmit = async () => {
    const trimmedFolder = newFolderName.trim();

    // Check if the folder name is empty or exceeds the character limit
    if (!trimmedFolder) {
      showSnackbar("Please enter a folder name.", "top", "error");
      return;
    }

    // Check if the folder name exceeds 30 characters
    if (trimmedFolder.length > 30) {
      showSnackbar(
        "Folder name must be less than 30 characters.",
        "top",
        "error",
      );
      return;
    }

    // Check for duplicate folder names
    const isDuplicate = folders.some(
      (folder) =>
        folder.folderName.trim().toLowerCase() ===
          trimmedFolder.toLowerCase() &&
        (!editMode || folder.folderID !== editingFolder?.folderID),
    );

    if (isDuplicate) {
      showSnackbar("A folder with this name already exists.", "top", "error");
      return;
    }

    try {
      let success = false;

      if (editMode && editingFolder) {
        const updateResult = await folderService.updateFolder({
          ...editingFolder,
          folderName: trimmedFolder,
        });

        if (updateResult.success) {
          success = true;
          // remove all prior errors from the folder update source if service call succeeded
          setErrors((prev) =>
            prev.filter((error) => error.source !== "folder:update"),
          );
        } else {
          // set all errors to the previous errors plus add the new error
          // define the id and the source and set its read status to false
          setErrors((prev) => [
            ...prev,
            {
              ...updateResult.error,
              hasBeenRead: false,
              id: `${Date.now()}-${Math.random()}`,
              source: "folder:update",
            },
          ]);
          setShowError(true);
          success = false;
        }
      } else {
        const newFolderObject: FolderDTO = { folderName: trimmedFolder };
        const insertResult = await folderService.insertFolder(newFolderObject);
        if (insertResult.success) {
          success = true;

          // remove all prior errors from the folder insert source if service call succeeded
          setErrors((prev) =>
            prev.filter((error) => error.source !== "folder:insert"),
          );
          router.push("/folders?reload=1");

          if (success) setShouldRefetch(true);
          showSnackbar(
            editMode
              ? "Folder updated successfully."
              : "Folder created successfully.",
            "top",
            "success",
          );
        } else {
          // set all errors to the previous errors plus add the new error
          // define the id and the source and set its read status to false
          setErrors((prev) => [
            ...prev,
            {
              ...insertResult.error,
              hasBeenRead: false,
              id: `${Date.now()}-${Math.random()}`,
              source: "folder:insert",
            },
          ]);
          setShowError(true);
        }
      }
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

  /**
   * Effect to fetch folders when the modal becomes visible.
   */
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const result = await folderService.getAllFolders();
        if (result.success) {
          setFolders(result.value ?? []);
        } else {
          showSnackbar("Failed to fetch folders.", "top", "error");
        }
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    if (isVisible) {
      fetchFolders();
      setIsModalVisible(true);
      setShouldRenderSheet(true);
      slideAnim.setValue(Dimensions.get("window").height);
      // Animate the bottom sheet to slide up
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      // Animate the bottom sheet to slide down
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
      <Modal
        transparent
        visible={isModalVisible}
        accessibilityViewIsModal={true}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
          accessible={false}
          importantForAccessibility="no"
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
                        accessibilityRole="button"
                        accessibilityLabel="Create a note"
                        accessibilityHint="Opens the screen to create a new note"
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
                        accessibilityRole="button"
                        accessibilityLabel="Create a collection"
                        accessibilityHint="Opens the screen to create a new collection"
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
                        accessibilityRole="button"
                        accessibilityLabel="Create a folder"
                        accessibilityHint="Opens the screen to create a new folder"
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

      <ErrorPopup
        visible={showError && errors.some((e) => !e.hasBeenRead)}
        errors={errors.filter((e) => !e.hasBeenRead) || []}
        onClose={(updatedErrors) => {
          // all current errors get tagged as hasBeenRead true on close of the modal (dimiss or click outside)
          const updatedIds = updatedErrors.map((e) => e.id);
          const newCombined = errors.map((e) =>
            updatedIds.includes(e.id) ? { ...e, hasBeenRead: true } : e,
          );
          setErrors(newCombined);
          setShowError(false);
        }}
      />
    </>
  );
};
