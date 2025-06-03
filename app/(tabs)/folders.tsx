import { FlatList, Image, Platform, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import { MaterialIcons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import { EmptyHome } from "@/components/emptyHome/emptyHome";
import React, { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import { useRouter } from "expo-router";
import QuickActionModal from "@/components/Modals/QuickActionModal/QuickActionModal";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";
import FolderComponent from "@/components/ui/FolderComponent/FolderComponent";
import { IconTopRight } from "@/components/ui/IconTopRight/IconTopRight";
import { useServices } from "@/context/ServiceContext";
import { FolderDTO } from "@/shared/dto/FolderDTO";
import { BottomInputModal } from "@/components/Modals/BottomInputModal/BottomInputModal";
import { useLocalSearchParams } from "expo-router";
import { EnrichedError } from "@/shared/error/ServiceError";
import { ErrorPopup } from "@/components/Modals/ErrorModal/ErrorModal";
export const getMaterialIcon = (name: string, size = 22, color = "black") => {
  return <MaterialIcons name={name as any} size={size} color={color} />;
};

export const getIconForPageType = (type: string) => {
  switch (type) {
    case "note":
      return getMaterialIcon("sticky-note-2");
    case "collection":
      return getMaterialIcon("collections-bookmark");
    default:
      return undefined;
  }
};

export default function FoldersScreen() {
  const { generalPageService, folderService } = useServices();
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme || "light"].tint;
  const { width } = useWindowDimensions();
  const columns = width >= 768 ? 3 : 2;
  const params = useLocalSearchParams();
  const router = useRouter();

  interface Folder {
    id: string;
    title: string;
    itemCount: number;
  }

  const [shouldReload, setShouldReload] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [folderNameInput, setFolderNameInput] = useState("");

  const [errors, setErrors] = useState<EnrichedError[]>([]);
  const [showError, setShowError] = useState(false);

  const filteredFolders = folders.filter((folder) =>
    folder.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleFolderSubmit = async () => {
    const trimmedName = folderNameInput.trim();
    if (!trimmedName || !editingFolder) return;

    if (trimmedName.length > 30) {
      showSnackbar(
        "Folder name must be less than 30 characters.",
        "top",
        "error",
      );
      return;
    }

    const isDuplicate = folders.some(
      (folder) =>
        folder.title.trim().toLowerCase() === trimmedName.toLowerCase() &&
        folder.id !== editingFolder.id,
    );

    if (isDuplicate) {
      showSnackbar("A folder with this name already exists.", "top", "error");
      return;
    }

    try {
      const updateResult = await folderService.updateFolder({
        folderID: Number(editingFolder.id),
        folderName: trimmedName,
        itemCount: editingFolder.itemCount,
      });

      if (updateResult.success) {
        showSnackbar("Folder updated", "bottom", "success");
        setShouldReload(true);

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
        showSnackbar("Update failed", "top", "error");
      }
    } finally {
      setEditMode(false);
      setEditingFolder(null);
      setFolderNameInput("");
    }
  };

  interface Folder {
    id: string;
    title: string;
    itemCount: number;
  }

  useFocusEffect(
    useCallback(() => {
      const fetchFolders = async () => {
        try {
          const folderResult = await folderService.getAllFolders();
          if (folderResult.success) {
            const shapedFolders = mapToFolderShape(folderResult.value);
            setFolders(shapedFolders);

            // remove all prior errors from the folder retrieval source if service call succeeded
            setErrors((prev) =>
              prev.filter((error) => error.source !== "folder:retrieval"),
            );
          } else {
            // set all errors to the previous errors plus add the new error
            // define the id and the source and set its read status to false
            setErrors((prev) => [
              ...prev,
              {
                ...folderResult.error,
                hasBeenRead: false,
                id: `${Date.now()}-${Math.random()}`,
                source: "folder:retrieval",
              },
            ]);
            setShowError(true);
          }
        } catch (error) {
          console.error("Error loading folders:", error);
        }
      };

      setShouldReload(false);
      fetchFolders();
    }, [shouldReload, params.reload]),
  );

  useEffect(() => {
    if (params.reload) {
      // Clear the reload param to allow future reloads to work
      router.replace("/folders");
    }
  }, [params.reload]);

  const mapToFolderShape = (data: FolderDTO[] | null): Folder[] => {
    if (data == null) {
      return [];
    } else {
      return (data || [])
        .sort((a, b) => (b.folderID ?? 0) - (a.folderID ?? 0))
        .map((folder) => ({
          id: String(folder.folderID),
          title: folder.folderName,
          itemCount: folder.itemCount ?? 0,
        }));
    }
  };

  const { showSnackbar } = useSnackbar();

  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  return (
    <>
      <SafeAreaView>
        <ThemedView>
          <IconTopRight onPress={() => router.push({ pathname: "/faq" })}>
            <Image
              source={require("@/assets/images/kriz.png")}
              style={{ width: 30, height: 32 }}
            />
          </IconTopRight>

          <ThemedText fontSize="xl" fontWeight="bold">
            Folders
          </ThemedText>

          {folders.length === 0 ? (
            <EmptyHome text="No folders yet" showButton={false} />
          ) : (
            <>
              <SearchBar
                placeholder="Search for folder name"
                onSearch={(query) => setSearchQuery(query)}
              />

              {filteredFolders.length === 0 ? (
                <ThemedView
                  style={{
                    marginTop: 32,
                    alignItems: "center",
                  }}
                >
                  <ThemedText fontSize="regular" fontWeight="regular">
                    No folders found for "{searchQuery}"
                  </ThemedText>
                </ThemedView>
              ) : (
                <FlatList
                  data={filteredFolders}
                  showsVerticalScrollIndicator={false}
                  numColumns={columns}
                  columnWrapperStyle={{
                    justifyContent: "space-between",
                    marginBottom: 16,
                    marginTop: 16,
                  }}
                  renderItem={({ item }) => (
                    <FolderComponent
                      title={item.title}
                      itemCount={item.itemCount}
                      key={item.id}
                      cardWidth={(width - 25 * (columns + 1)) / columns}
                      onPress={() => {
                        router.push({
                          pathname: "/folderPage",
                          params: { folderId: item.id, title: item.title },
                        });
                      }}
                      onLongPress={() => {
                        setSelectedFolder(item);
                        setShowModal(true);
                      }}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                />
              )}
            </>
          )}
        </ThemedView>
      </SafeAreaView>
      <QuickActionModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        items={[
          {
            label: "Edit Folder",
            icon: "edit",
            onPress: () => {
              setFolderNameInput(selectedFolder?.title ?? "");
              setEditingFolder(selectedFolder);
              setEditMode(true);
              setShowModal(false);
            },
          },
          {
            label: "Delete",
            icon: "delete",
            onPress: () => setShowDeleteModal(true),
            danger: true,
          },
        ]}
      />
      <DeleteModal
        visible={showDeleteModal}
        title={selectedFolder?.title}
        extraInformation="Deleting this folder will remove all items inside it as well."
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (selectedFolder) {
            try {
              const folderIdAsNumber = Number(selectedFolder.id);
              const deleteResult =
                await folderService.deleteFolder(folderIdAsNumber);

              if (deleteResult.success) {
                setShouldReload(true);

                // remove all prior errors from the folder delete source if service call succeeded
                setErrors((prev) =>
                  prev.filter((error) => error.source !== "folder:delete"),
                );
              } else {
                // set all errors to the previous errors plus add the new error
                // define the id and the source and set its read status to false
                setErrors((prev) => [
                  ...prev,
                  {
                    ...deleteResult.error,
                    hasBeenRead: false,
                    id: `${Date.now()}-${Math.random()}`,
                    source: "folder:delete",
                  },
                ]);
                setShowError(true);
                showSnackbar("Failed to delete folder.", "top", "error");
              }

              setSelectedFolder(null);
              setShowDeleteModal(false);
            } catch (error) {
              console.error("Error deleting page:", error);
            }
          }
        }}
        onclose={() => setShowDeleteModal(false)}
      />
      <BottomInputModal
        visible={editMode}
        value={folderNameInput}
        onChangeText={setFolderNameInput}
        onSubmit={handleFolderSubmit}
        onClose={() => {
          setEditMode(false);
          setEditingFolder(null);
          setFolderNameInput("");
        }}
        placeholderText="Enter new folder name"
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
}
