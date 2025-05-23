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
import React, { useState, useCallback } from "react";
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

  const router = useRouter();

  interface Folder {
    id: string;
    title: string;
    itemCount: number;
  }

  const [shouldReload, setShouldReload] = useState<boolean>(false);
  // const [widgets, setWidgets] = useState<ArchivedWidget[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [folderNameInput, setFolderNameInput] = useState("");

  const getColorKeyFromValue = (
    value: string,
  ): keyof typeof Colors.widget | undefined => {
    const colorKeys = Object.keys(Colors.widget);

    return colorKeys.find((key) => {
      const currentColor = Colors.widget[key as keyof typeof Colors.widget];
      return (
        value === key || // if the value is already the color key like "rose"
        (typeof currentColor === "string" && currentColor === value) || // hex match
        (Array.isArray(currentColor) && currentColor.includes(value)) // match inside gradients
      );
    }) as keyof typeof Colors.widget | undefined;
  };

  // const mapToEnrichedWidgets = (
  //   data: GeneralPageDTO[] | null,
  // ): ArchivedWidget[] => {
  //   if (data == null) {
  //     return [];
  //   } else {
  //     const enrichedWidgets: ArchivedWidget[] = (data || []).map((widget) => ({
  //       id: String(widget.pageID),
  //       title: widget.page_title,
  //       tag: widget.tag?.tag_label || "Uncategorized",
  //       color:
  //         getColorKeyFromValue(widget.page_color || "#4599E8") ?? "#4599E8",
  //       page_type: widget.page_type,
  //       icon: widget.page_icon ? getMaterialIcon(widget.page_icon) : undefined,
  //       archived: widget.archived,
  //     }));
  //     return enrichedWidgets;
  //   }
  // };

  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchWidgets = async () => {
  //       try {
  //         const data = await getAllGeneralPageData(GeneralPageState.Archived);

  //         const enrichedWidgets: ArchivedWidget[] = mapToEnrichedWidgets(data);

  //         setWidgets(enrichedWidgets);
  //       } catch (error) {
  //         console.error("Error loading widgets:", error);
  //       }
  //     };

  //     setShouldReload(false);
  //     fetchWidgets();
  //   }, [shouldReload]),
  // );

  // const filteredWidgets = useMemo(() => {
  //   const lowerQuery = searchQuery.toLowerCase();
  //   return widgets.filter((widget) =>
  //     widget.title.toLowerCase().includes(lowerQuery),
  //   );
  // }, [widgets, searchQuery]);

  // useEffect(() => {}, [widgets]);

  // const goToPage = (widget: ArchivedWidget) => {
  //   const path =
  //     widget.page_type === PageType.Note ? "/notePage" : "/collectionPage";

  //   router.push({
  //     pathname: path,
  //     params: { pageId: widget.id, title: widget.title },
  //   });
  // };

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

    try {
      const success = await folderService.updateFolder({
        folderID: Number(editingFolder.id),
        folderName: trimmedName,
        itemCount: editingFolder.itemCount,
      });

      if (success) {
        showSnackbar("Folder updated", "top", "success");
        setShouldReload(true);
      }
    } catch (error) {
      console.error("Error updating folder:", error);
      showSnackbar("Update failed", "top", "error");
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
          const data = await folderService.getAllFolders();

          const shapedFolders = mapToFolderShape(data);
          setFolders(shapedFolders);
        } catch (error) {
          console.error("Error loading folders:", error);
        }
      };

      setShouldReload(false);
      fetchFolders();
    }, [shouldReload]),
  );
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

  const { showSnackbar } = useSnackbar();

  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  return (
    <>
      <SafeAreaView>
        <ThemedView>
          <IconTopRight>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/faq",
                });
              }}
            >
              <Image
                source={require("@/assets/images/kriz.png")}
                style={{ width: 30, height: 32 }}
              />
            </TouchableOpacity>
          </IconTopRight>

          <ThemedText fontSize="xl" fontWeight="bold">
            Folders
          </ThemedText>

          {folders.length === 0 ? (
            <EmptyHome text="No folders yet" showButton={false} />
          ) : (
            <>
              <SearchBar
                placeholder="Search for title"
                onSearch={(query) => setSearchQuery(query)}
              />

              {/* {filteredWidgets.length > 0 ? ( */}
              {/* <> */}
              <FlatList
                data={folders}
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
              {/* </>
              ) : (
                <ThemedText
                  fontSize="regular"
                  fontWeight="regular"
                  style={{ textAlign: "center", marginTop: 25 }}
                >
                  {!searchQuery
                    ? "No entries found."
                    : `No entries for "${searchQuery}"`}
                </ThemedText>
              )} */}
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
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (selectedFolder) {
            try {
              const folderIdAsNumber = Number(selectedFolder.id);
              const successfullyDeleted =
                await folderService.deleteFolder(folderIdAsNumber);

              setShouldReload(successfullyDeleted);

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
    </>
  );
}
