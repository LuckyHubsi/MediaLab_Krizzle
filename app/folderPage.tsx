import {
  ScrollView,
  View,
  Pressable,
  AccessibilityInfo,
  Platform,
  findNodeHandle,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import Widget from "@/components/ui/Widget/Widget";
import { MaterialIcons } from "@expo/vector-icons";
import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useFocusEffect } from "@react-navigation/native";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import { useLocalSearchParams, useRouter } from "expo-router";
import QuickActionModal from "@/components/Modals/QuickActionModal/QuickActionModal";
import { ModalSelection } from "@/components/Modals/CreateNCModal/CreateNCModal";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { TagDTO } from "@/shared/dto/TagDTO";
import { PageType } from "@/shared/enum/PageType";
import { FolderState } from "@/shared/enum/FolderState";
import { GeneralPageDTO } from "@/shared/dto/GeneralPageDTO";
import { FolderDTO } from "@/shared/dto/FolderDTO";
import { useServices } from "@/context/ServiceContext";
import { BottomInputModal } from "@/components/Modals/BottomInputModal/BottomInputModal";
import SelectFolderModal from "@/components/ui/SelectFolderModal/SelectFolderModal";
import { EnrichedError } from "@/shared/error/ServiceError";
import { ErrorPopup } from "@/components/Modals/ErrorModal/ErrorModal";

/**
 * Returns a Material icon component with the specified name, size, and color.
 */
export const getMaterialIcon = (name: string, size = 22, color = "black") => {
  return <MaterialIcons name={name as any} size={size} color={color} />;
};

/**
 * Returns the appropriate icon for a given page type.
 */
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

/**
 * Inside Folder Screen that displays a folder with its widgets.
 */
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
  const [shouldReload, setShouldReload] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedTag, setSelectedTag] = useState<TagDTO | "All">("All");
  const [pinnedWidgets, setPinnedWidgets] = useState<Widget[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
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
  const [errors, setErrors] = useState<EnrichedError[]>([]);
  const [showError, setShowError] = useState(false);
  const { showSnackbar } = useSnackbar();
  const [searchAnnouncement, setSearchAnnouncement] = useState("");
  const [sortAnnouncement, setSortAnnouncement] = useState("");
  const headerRef = useRef<View | null>(null);

  /**
   * Widget interface that represents a widget in the folder.
   * * @property {string} id - Unique identifier for the widget.
   * * @property {string} title - Title of the widget.
   * * @property {TagDTO} tag - Tag associated with the widget.
   * * @property {string} [page_icon] - Optional icon for the widget.
   * * @property {PageType} page_type - Type of the page (note or collection).
   * * @property {string} [color] - Color of the widget, defaults to primary color.
   * * @property {boolean} archived - Indicates if the widget is archived.
   * * @property {boolean} pinned - Indicates if the widget is pinned.
   * * @property {any} [key: string] - Additional properties can be added dynamically.
   */
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

  /**
   * Function to get the color key from a value.
   */
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

  /**
   * Maps the GeneralPageDTO data to enriched widgets.
   */
  const mapToEnrichedWidgets = (data: GeneralPageDTO[] | null): Widget[] => {
    if (!data) return [];
    return data.map((widget) => ({
      id: String(widget.pageID),
      title: widget.page_title,
      tag: widget.tag || { tag_label: "Uncategorized" },
      color:
        getColorKeyFromValue(widget.page_color || Colors.primary) ??
        Colors.primary,
      page_type: widget.page_type,
      icon: widget.page_icon ? getMaterialIcon(widget.page_icon) : undefined,
      archived: widget.archived,
      pinned: widget.pinned,
    }));
  };

  /**
   * Handles the update of the folder name.
   */
  const handleFolderUpdate = async () => {
    const trimmedName = folderNameInput.trim();
    if (!folder) return;

    if (!trimmedName) {
      showSnackbar("Please enter a folder name.", "top", "error");
      return;
    }

    if (trimmedName.length > 30) {
      showSnackbar(
        "Folder name must be less than 30 characters.",
        "top",
        "error",
      );
      return;
    }

    try {
      const allFoldersResult = await folderService.getAllFolders();

      if (allFoldersResult.success) {
        const duplicate = allFoldersResult.value.find(
          (f) =>
            f.folderID !== folder.folderID &&
            f.folderName.trim().toLowerCase() === trimmedName.toLowerCase(),
        );

        if (duplicate) {
          showSnackbar(
            "A folder with this name already exists.",
            "top",
            "error",
          );
          return;
        }
      }

      const updateResult = await folderService.updateFolder({
        folderID: folder.folderID,
        folderName: trimmedName,
        itemCount: folder.itemCount ?? 0,
      });

      if (updateResult.success) {
        showSnackbar("Folder updated", "bottom", "success");
        setShouldReload(true);
        setFolderEditMode(false);
        setFolderNameInput("");
        setErrors((prev) =>
          prev.filter((error) => error.source !== "folder:update"),
        );
      } else {
        showSnackbar("Update failed", "top", "error");
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
      }
    } catch (error) {
      console.error("Error updating folder:", error);
      showSnackbar("Update failed", "top", "error");
    }
  };

  /**
   * Focus effect to load folder and widgets data when the screen is focused.
   * It retrieves the folder details and all widgets associated with it.
   */
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        if (!folderId) return;

        try {
          const folderResult = await folderService.getFolder(Number(folderId));
          if (folderResult.success) {
            setFolder(folderResult.value);

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
          const widgetResult =
            await generalPageService.getAllFolderGeneralPageData(
              sortingMode,
              Number(folderId),
            );
          if (widgetResult.success) {
            const enrichedWidgets = mapToEnrichedWidgets(widgetResult.value);
            setWidgets(enrichedWidgets);

            // remove all prior errors from the folder widget retrieval source if service call succeeded
            setErrors((prev) =>
              prev.filter(
                (error) => error.source !== "folder:widgets:retrieval",
              ),
            );
          } else {
            // set all errors to the previous errors plus add the new error
            // define the id and the source and set its read status to false
            setErrors((prev) => [
              ...prev,
              {
                ...widgetResult.error,
                hasBeenRead: false,
                id: `${Date.now()}-${Math.random()}`,
                source: "folder:widgets:retrieval",
              },
            ]);
            setShowError(true);
          }
        } catch (error) {
          console.error("Error loading folder:", error);
        }

        setShouldReload(false);
      };

      loadData();

      const timeout = setTimeout(() => {
        const node = findNodeHandle(headerRef.current);
        if (node) {
          AccessibilityInfo.setAccessibilityFocus(node);
        }
      }, 100);

      return () => clearTimeout(timeout);
    }, [folderId, sortingMode, shouldReload]),
  );

  /**
   * Filters the widgets based on the selected tag and search query.
   */
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

  /**
   * Filters the widgets based on the selected tag and search query.
   */
  const filteredWidgets = useMemo(
    () => filter(widgets),
    [widgets, selectedTag, searchQuery],
  );
  const filteredPinnedWidgets = useMemo(
    () => filter(pinnedWidgets),
    [pinnedWidgets, selectedTag, searchQuery],
  );

  /**
   * Navigates to the page of the selected widget.
   */
  const goToPage = (widget: Widget) => {
    const path =
      widget.page_type === PageType.Note ? "/notePage" : "/collectionPage";
    router.push({
      pathname: path,
      params: { pageId: widget.id, title: widget.title },
    });
  };

  /**
   * Navigates to the edit page of the selected widget.
   */
  const goToEditPage = (widget: Widget) => {
    router.push({ pathname: "/editWidget", params: { widgetID: widget.id } });
  };

  /**
   * effect to announce search result with screen reader.
   */
  useEffect(() => {
    if (searchQuery) {
      const message =
        filteredWidgets.length > 0
          ? `${filteredWidgets.length} result${filteredWidgets.length > 1 ? "s" : ""} found for ${searchQuery}`
          : `No entries found for ${searchQuery}`;
      setSearchAnnouncement(message);
    }
  }, [searchQuery, filteredWidgets]);
  useEffect(() => {
    const announce = sortAnnouncement || searchAnnouncement;

    if (announce) {
      if (Platform.OS === "android") {
        AccessibilityInfo.announceForAccessibility(announce);
      }

      const timeout = setTimeout(() => {
        setSortAnnouncement("");
        setSearchAnnouncement("");
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [searchAnnouncement]);

  /**
   * effect to announce new sorting mode with screen reader.
   */
  useEffect(() => {
    if (sortAnnouncement) {
      // Android workaround
      if (Platform.OS === "android") {
        AccessibilityInfo.announceForAccessibility(sortAnnouncement);
      }

      // Fallback live region announcement
      const timeout = setTimeout(() => setSortAnnouncement(""), 1000);
      return () => clearTimeout(timeout);
    }
  }, [sortAnnouncement]);

  /**
   * Components used:
   *
   * - CustomStyledHeader: A custom header component with a title and icon.
   * - ThemedView: A themed view component that applies the current theme.
   * - SearchBar: A search bar component for filtering widgets.
   * - ThemedText: A themed text component for displaying text.
   * - Widget: A widget component that displays individual widgets.
   * - QuickActionModal: A modal for quick actions like deletion, editing, and moving widgets.
   * - ModalSelection: A modal for selecting options.
   * - DeleteModal: A modal for confirming deletions.
   * - BottomInputModal: A modal for inputting text, used for editing folder names.
   * - SelectFolderModal: A modal for selecting a folder to move widgets.
   * - ErrorPopup: A popup for displaying errors.
   */
  return (
    <>
      <SafeAreaView>
        <CustomStyledHeader
          title={folder?.folderName ?? ""}
          iconName="more-horiz"
          onIconPress={() => setShowFolderModal(true)}
          headerRef={headerRef}
        />
        <ThemedView>
          {widgets.length === 0 && pinnedWidgets.length === 0 ? (
            <ThemedText textIsCentered>Your Folder is empty.</ThemedText>
          ) : (
            <>
              <SearchBar
                placeholder="Search for widget title"
                onSearch={setSearchQuery}
              />

              <ThemedText
                accessibilityLiveRegion="assertive"
                accessible={true}
                style={{
                  position: "absolute",
                  opacity: 0,
                  height: 0,
                  width: 0,
                }}
              >
                {sortAnnouncement || searchAnnouncement}
              </ThemedText>

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
                      {filteredPinnedWidgets.map((item, index) => (
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
                          index={index + 1}
                          widgetCount={filteredPinnedWidgets.length}
                          state="folder"
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
                      <ThemedText
                        fontSize="regular"
                        fontWeight="regular"
                        accessible={true}
                        accessibilityRole="header"
                        accessibilityLabel="Recent widgets"
                      >
                        Recent
                      </ThemedText>
                      <Pressable
                        onPress={() => setShowSortModal(true)}
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel="Sorting modes"
                        accessibilityHint={`Opens a menu for changing between widget sorting modes. Currently selected sorting mode ${sortingMode}`}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 6,
                            minHeight: 48,
                            alignItems: "center",
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
                          <ThemedText
                            accessibilityLiveRegion="assertive"
                            accessible={true}
                            style={{
                              position: "absolute",
                              opacity: 0,
                              height: 0,
                              width: 0,
                            }}
                          >
                            {sortAnnouncement}
                          </ThemedText>
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
                      {filteredWidgets.map((item, index) => (
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
                          index={index + 1}
                          widgetCount={filteredWidgets.length}
                          state="folder"
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
        </ThemedView>
      </SafeAreaView>

      <QuickActionModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        items={[
          {
            label: "Last modified descending",
            icon: "swap-vert",
            disabled: sortingMode === FolderState.GeneralModfied,
            onPress: () => {
              setSortingMode(FolderState.GeneralModfied);
              setShowSortModal(false);
              setSortAnnouncement(
                "Sorting changed to: Last modified descending",
              );
            },
          },
          {
            label: "Alphabet ascending",
            icon: "sort-by-alpha",
            disabled: sortingMode === FolderState.GeneralAlphabet,
            onPress: () => {
              setSortingMode(FolderState.GeneralAlphabet);
              setShowSortModal(false);
              setSortAnnouncement("Sorting changed to: Alphabet ascending");
            },
          },
          {
            label: "Created ascending",
            icon: "sort",
            disabled: sortingMode === FolderState.GeneralCreated,
            onPress: () => {
              setSortingMode(FolderState.GeneralCreated);
              setShowSortModal(false);
              setSortAnnouncement("Sorting changed to: Created ascending");
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
                  const updateResult = await generalPageService.updateFolderID(
                    Number(selectedWidget.id),
                    null,
                  );

                  if (updateResult.success) {
                    showSnackbar("Moved back to home", "bottom", "success");
                    setShouldReload(true);

                    // remove all prior errors from the widget move source if service call succeeded
                    setErrors((prev) =>
                      prev.filter((error) => error.source !== "widget:move"),
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
                        source: "widget:move",
                      },
                    ]);
                    setShowError(true);
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
            label: "Edit Widget",
            icon: "edit",
            onPress: () => selectedWidget && goToEditPage(selectedWidget),
          },
          {
            label: "Archive",
            icon: "archive",
            onPress: async () => {
              if (selectedWidget) {
                const archiveResult =
                  await generalPageService.togglePageArchive(
                    Number(selectedWidget.id),
                    selectedWidget.archived,
                  );

                if (archiveResult.success) {
                  showSnackbar(
                    `Successfully moved ${selectedWidget.page_type === "note" ? "Note" : "Collection"} to Archive in Menu.`,
                    "bottom",
                    "success",
                  );

                  // remove all prior errors from the archiving source if service call succeeded
                  setErrors((prev) =>
                    prev.filter((error) => error.source !== "archiving"),
                  );
                } else {
                  // set all errors to the previous errors plus add the new error
                  // define the id and the source and set its read status to false
                  setErrors((prev) => [
                    ...prev,
                    {
                      ...archiveResult.error,
                      hasBeenRead: false,
                      id: `${Date.now()}-${Math.random()}`,
                      source: "archiving",
                    },
                  ]);
                  setShowError(true);
                  showSnackbar(
                    `Failed to move ${selectedWidget.page_type === "note" ? "Note" : "Collection"} to Archive in Menu.`,
                    "bottom",
                    "error",
                  );
                }
                setShouldReload(true);
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
        extraInformation="Deleting this folder will remove all items inside it as well."
        onCancel={() => setShowFolderDeleteModal(false)}
        onConfirm={async () => {
          if (folder) {
            try {
              const deleteResult = await folderService.deleteFolder(
                Number(folder.folderID),
              );
              if (deleteResult.success) {
                showSnackbar("Folder deleted", "bottom", "success");
                router.replace("/folders");

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
                showSnackbar("Error deleting folder", "top", "error");
              }
            } catch (error) {
              console.error("Error deleting folder:", error);
              showSnackbar("Error deleting folder", "top", "error");
            } finally {
              setShowFolderDeleteModal(false);
            }
          }
        }}
        onClose={() => setShowFolderDeleteModal(false)}
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
              const deleteResult = await generalPageService.deleteGeneralPage(
                Number(selectedWidget.id),
              );

              if (deleteResult.success) {
                setShouldReload(true);

                showSnackbar("Widget deleted", "bottom", "success");

                // remove all prior errors from the widget delete source if service call succeeded
                setErrors((prev) =>
                  prev.filter((error) => error.source !== "widget:delete"),
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
                    source: "widget:delete",
                  },
                ]);
                setShowError(true);
                showSnackbar("Error deleting widget", "top", "error");
              }
              setSelectedWidget(null);
            } catch (error) {
              console.error("Error deleting widget:", error);
              showSnackbar("Error deleting widget", "top", "error");
            } finally {
              setShowWidgetDeleteModal(false);
            }
          }
        }}
        onClose={() => setShowWidgetDeleteModal(false)}
      />

      <SelectFolderModal
        widgetTitle={selectedWidget?.title}
        widgetId={selectedWidget?.id}
        initialSelectedFolderId={Number(folderId)}
        visible={showFolderSelectionModal}
        onClose={() => setShowFolderSelectionModal(false)}
        onMoved={() => setShouldReload(true)}
      />

      <ErrorPopup
        visible={showError && errors.some((e) => !e.hasBeenRead)}
        errors={errors.filter((e) => !e.hasBeenRead) || []}
        onClose={(updatedErrors) => {
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
