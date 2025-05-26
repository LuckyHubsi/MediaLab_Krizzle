import { ScrollView, View, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import Widget from "@/components/ui/Widget/Widget";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useMemo, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import { useLocalSearchParams, useRouter } from "expo-router";
import QuickActionModal from "@/components/Modals/QuickActionModal/QuickActionModal";
import { ModalSelection } from "@/components/Modals/CreateNCModal/CreateNCModal";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { FloatingAddButton } from "@/components/ui/NavBar/FloatingAddButton/FloatingAddButton";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { TagDTO } from "@/shared/dto/TagDTO";
import { PageType } from "@/shared/enum/PageType";
import { FolderState } from "@/shared/enum/FolderState";
import { GeneralPageDTO } from "@/shared/dto/GeneralPageDTO";
import { FolderDTO } from "@/shared/dto/FolderDTO";
import { useServices } from "@/context/ServiceContext";
import { BottomInputModal } from "@/components/Modals/BottomInputModal/BottomInputModal";
import SelectFolderModal from "@/components/ui/SelectFolderModal/SelectFolderModal";

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

export default function FolderScreen() {
  const { folderId, title } = useLocalSearchParams<{
    folderId: string;
    title: string;
  }>();
  const { generalPageService, tagService, folderService } = useServices();
  const colorScheme = useActiveColorScheme();
  const router = useRouter();
  const [folderEditMode, setFolderEditMode] = useState(false);
  const [folderNameInput, setFolderNameInput] = useState("");
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showWidgetModal, setShowWidgetModal] = useState(false);

  interface Widget {
    id: string;
    title: string;
    tag: TagDTO;
    page_icon?: string;
    page_type: PageType;
    color?: string;
    archived: boolean;
    pinned: boolean;
    [key: string]: any;
  }

  const [shouldReload, setShouldReload] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedTag, setSelectedTag] = useState<TagDTO | "All">("All");
  const [pinnedWidgets, setPinnedWidgets] = useState<Widget[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [tags, setTags] = useState<TagDTO[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFolderDeleteModal, setShowFolderDeleteModal] = useState(false);
  const [showWidgetDeleteModal, setShowWidgetDeleteModal] = useState(false);
  const [showFolderSelectionModal, setShowFolderSelectionModal] =
    useState(false);

  const [sortingMode, setSortingMode] = useState<FolderState>(
    FolderState.GeneralModfied,
  );
  const [folder, setFolder] = useState<FolderDTO | null>(null);

  const getColorKeyFromValue = (
    value: string,
  ): keyof typeof Colors.widget | undefined => {
    const colorKeys = Object.keys(Colors.widget);
    return colorKeys.find((key) => {
      const currentColor = Colors.widget[key as keyof typeof Colors.widget];
      return (
        value === key ||
        (typeof currentColor === "string" && currentColor === value) ||
        (Array.isArray(currentColor) && currentColor.includes(value))
      );
    }) as keyof typeof Colors.widget | undefined;
  };

  const mapToEnrichedWidgets = (data: GeneralPageDTO[] | null): Widget[] => {
    if (!data) return [];
    return data.map((widget) => ({
      id: String(widget.pageID),
      title: widget.page_title,
      tag: widget.tag || { tag_label: "Uncategorized" },
      color: getColorKeyFromValue(widget.page_color || "#4599E8") ?? "#4599E8",
      page_type: widget.page_type,
      icon: widget.page_icon ? getMaterialIcon(widget.page_icon) : undefined,
      archived: widget.archived,
      pinned: widget.pinned,
    }));
  };
  const handleFolderUpdate = async () => {
    const trimmedName = folderNameInput.trim();
    if (!folder || !trimmedName) return;

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
        folderID: folder.folderID,
        folderName: trimmedName,
        itemCount: folder.itemCount ?? 0,
      });

      if (success) {
        showSnackbar("Folder updated", "bottom", "success");
        setShouldReload(true);
      }
    } catch (error) {
      console.error("Error updating folder:", error);
      showSnackbar("Update failed", "top", "error");
    } finally {
      setFolderEditMode(false);
      setFolderNameInput("");
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        if (!folderId) return;

        try {
          const result = await folderService.getFolder(Number(folderId));
          if (result.success) {
            setFolder(result.value);
          } else {
            // TODO: show error modal
          }
          const resultFolder =
            await generalPageService.getAllFolderGeneralPageData(
              sortingMode,
              Number(folderId),
            );
          if (resultFolder.success) {
            const enrichedWidgets = mapToEnrichedWidgets(resultFolder.value);
            setWidgets(enrichedWidgets);
          } else {
            // TODO: show error modal
          }
        } catch (error) {
          console.error("Error loading folder:", error);
        }

        try {
          const result = await tagService.getAllTags();
          if (result.success) {
            setTags(result.value);
          } else {
            // TODO: show error modal
          }
        } catch (error) {
          console.error("Failed to load tags:", error);
        }

        setShouldReload(false);
      };

      loadData();
    }, [folderId, sortingMode, shouldReload]),
  );

  const filter = (widgets: Widget[]) => {
    const lowerQuery = searchQuery.toLowerCase();
    return widgets.filter((widget) => {
      const matchesTag =
        selectedTag === "All" ||
        (widget.tag &&
          selectedTag.tag_label !== "All" &&
          widget.tag.tagID === selectedTag.tagID);

      const matchesTitle = widget.title.toLowerCase().includes(lowerQuery);
      return matchesTag && matchesTitle;
    });
  };

  const filteredWidgets = useMemo(
    () => filter(widgets),
    [widgets, selectedTag, searchQuery],
  );
  const filteredPinnedWidgets = useMemo(
    () => filter(pinnedWidgets),
    [pinnedWidgets, selectedTag, searchQuery],
  );

  const goToPage = (widget: Widget) => {
    const path =
      widget.page_type === PageType.Note ? "/notePage" : "/collectionPage";
    router.push({
      pathname: path,
      params: { pageId: widget.id, title: widget.title },
    });
  };

  const goToEditPage = (widget: Widget) => {
    router.push({ pathname: "/editWidget", params: { widgetID: widget.id } });
  };

  const { showSnackbar } = useSnackbar();

  return (
    <>
      <SafeAreaView>
        <CustomStyledHeader
          title={folder?.folderName ?? ""}
          iconName="more-horiz"
          onIconPress={() => setShowFolderModal(true)}
        />
        <ThemedView>
          {widgets.length === 0 && pinnedWidgets.length === 0 ? (
            <ThemedText textIsCentered>Your Folder is empty.</ThemedText>
          ) : (
            <>
              <SearchBar placeholder="Search" onSearch={setSearchQuery} />

              <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
              >
                {filteredPinnedWidgets.length > 0 && (
                  <>
                    <ThemedText
                      fontSize="regular"
                      fontWeight="regular"
                      style={{ marginBottom: 8 }}
                    >
                      Pinned
                    </ThemedText>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        rowGap: 16,
                        marginBottom: 24,
                      }}
                    >
                      {filteredPinnedWidgets.map((item) => (
                        <Widget
                          key={item.id}
                          title={item.title}
                          label={item.tag.tag_label}
                          icon={item.icon}
                          color={item.color as keyof typeof Colors.widget}
                          pageType={item.page_type}
                          onPress={() => goToPage(item)}
                          onLongPress={() => {
                            setSelectedWidget(item);
                            setShowWidgetModal(true);
                          }}
                        />
                      ))}
                    </View>
                  </>
                )}

                {filteredWidgets.length > 0 && (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <ThemedText fontSize="regular" fontWeight="regular">
                        Recent
                      </ThemedText>
                      <Pressable onPress={() => setShowSortModal(true)}>
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 6,
                          }}
                        >
                          <ThemedText fontSize="s" fontWeight="regular">
                            Sort by
                          </ThemedText>
                          <MaterialIcons
                            name="filter-list"
                            size={20}
                            color={Colors[colorScheme || "light"].text}
                          />
                        </View>
                      </Pressable>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        rowGap: 16,
                      }}
                    >
                      {filteredWidgets.map((item) => (
                        <Widget
                          key={item.id}
                          title={item.title}
                          label={item.tag.tag_label}
                          icon={item.icon}
                          color={item.color as keyof typeof Colors.widget}
                          pageType={item.page_type}
                          onPress={() => goToPage(item)}
                          onLongPress={() => {
                            setSelectedWidget(item);
                            setShowWidgetModal(true);
                          }}
                        />
                      ))}
                    </View>
                  </>
                )}

                {filteredPinnedWidgets.length <= 0 &&
                  filteredWidgets.length <= 0 && (
                    <ThemedText
                      fontSize="regular"
                      fontWeight="regular"
                      style={{ textAlign: "center", marginTop: 25 }}
                    >
                      {selectedTag === "All" && !searchQuery
                        ? "No entries found."
                        : `No entries for "${selectedTag !== "All" ? selectedTag.tag_label : searchQuery}"`}
                    </ThemedText>
                  )}
              </ScrollView>
            </>
          )}

          <View
            style={{
              position: "absolute",
              right: 10,
              bottom: 50,
            }}
          >
            {/* TODO: Add onPress Logic */}
            <FloatingAddButton onPress={() => {}} />
          </View>
        </ThemedView>
      </SafeAreaView>

      <QuickActionModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        items={[
          {
            label: "Last modified descending",
            icon: "swap-vert", // or "arrow-upward"/"arrow-downward"
            disabled: sortingMode === FolderState.GeneralModfied,
            onPress: () => {
              setSortingMode(FolderState.GeneralModfied);
              setShowSortModal(false);
            },
          },
          {
            label: "Alphabet ascending",
            icon: "sort-by-alpha",
            disabled: sortingMode === FolderState.GeneralAlphabet,
            onPress: () => {
              setSortingMode(FolderState.GeneralAlphabet);
              setShowSortModal(false);
            },
          },
        ]}
      />

      <QuickActionModal
        visible={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        items={[
          {
            label: "Edit Folder",
            icon: "edit",
            onPress: () => {
              setFolderNameInput(folder?.folderName ?? "");
              setFolderEditMode(true);
              setShowFolderModal(false);
            },
          },
          {
            label: "Delete Folder",
            icon: "delete",
            onPress: () => setShowFolderDeleteModal(true),
            danger: true,
          },
        ]}
      />
      <QuickActionModal
        visible={showWidgetModal}
        onClose={() => setShowWidgetModal(false)}
        items={[
          {
            label: "Move back Home",
            icon: "home",
            onPress: async () => {
              if (selectedWidget) {
                try {
                  const success = await generalPageService.updateFolderID(
                    Number(selectedWidget.id),
                    null,
                  );

                  if (success) {
                    showSnackbar("Moved back to home", "bottom", "success");
                    setShouldReload(true);
                  } else {
                    showSnackbar("Failed to move widget", "bottom", "error");
                  }
                } catch (error) {
                  console.error("Error moving back home:", error);
                  showSnackbar("Error moving widget", "top", "error");
                } finally {
                  setShowWidgetModal(false);
                }
              }
            },
          },
          {
            label: "Move to another Folder",
            icon: "folder",
            onPress: () => {
              setShowWidgetModal(false);
              setShowFolderSelectionModal(true);
            },
          },
          {
            label: "Delete Widget",
            icon: "delete",
            onPress: () => {
              setShowWidgetModal(false);
              setShowWidgetDeleteModal(true);
            },
            danger: true,
          },
        ]}
      />

      <ModalSelection
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />

      <DeleteModal
        visible={showFolderDeleteModal}
        title={folder?.folderName}
        onCancel={() => setShowFolderDeleteModal(false)}
        onConfirm={async () => {
          if (folder) {
            try {
              const success = await folderService.deleteFolder(
                Number(folder.folderID),
              );
              if (success) {
                showSnackbar("Folder deleted", "bottom", "success");
                router.replace("/folders");
              }
            } catch (error) {
              console.error("Error deleting folder:", error);
              showSnackbar("Error deleting folder", "top", "error");
            } finally {
              setShowFolderDeleteModal(false);
            }
          }
        }}
        onclose={() => setShowFolderDeleteModal(false)}
      />
      <BottomInputModal
        visible={folderEditMode}
        value={folderNameInput}
        onChangeText={setFolderNameInput}
        onSubmit={handleFolderUpdate}
        onClose={() => {
          setFolderEditMode(false);
          setFolderNameInput("");
        }}
        placeholderText="Enter new folder name"
      />
      <DeleteModal
        visible={showWidgetDeleteModal}
        title={selectedWidget?.title}
        onCancel={() => setShowWidgetDeleteModal(false)}
        onConfirm={async () => {
          if (selectedWidget) {
            try {
              const result = await generalPageService.deleteGeneralPage(
                Number(selectedWidget.id),
              );

              if (result.success) {
                setShouldReload(true);
              } else {
                // TODO: show error modal
              }
              setSelectedWidget(null);
              showSnackbar("Widget deleted", "bottom", "success");
            } catch (error) {
              console.error("Error deleting widget:", error);
              showSnackbar("Error deleting widget", "top", "error");
            } finally {
              setShowWidgetDeleteModal(false);
            }
          }
        }}
        onclose={() => setShowWidgetDeleteModal(false)}
      />
      <SelectFolderModal
        widgetTitle={selectedWidget?.title}
        widgetId={selectedWidget?.id}
        initialSelectedFolderId={Number(folderId)}
        visible={showFolderSelectionModal}
        onClose={() => setShowFolderSelectionModal(false)}
        onMoved={() => setShouldReload(true)}
      />
    </>
  );
}
