import {
  ScrollView,
  View,
  Image,
  Pressable,
  TouchableOpacity,
  Platform,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import Widget from "@/components/ui/Widget/Widget";
import { MaterialIcons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import TagList from "@/components/ui/TagList/TagList";
import { EmptyHome } from "@/components/emptyHome/emptyHome";
import React, { useState, useMemo, useCallback } from "react";
import { IconTopRight } from "@/components/ui/IconTopRight/IconTopRight";

import { useFocusEffect } from "@react-navigation/native";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import { GeneralPageDTO } from "@/shared/dto/GeneralPageDTO";
import { useRouter } from "expo-router";
import QuickActionModal from "@/components/Modals/QuickActionModal/QuickActionModal";
import { TagDTO } from "@/shared/dto/TagDTO";
import { ModalSelection } from "@/components/Modals/CreateNCModal/CreateNCModal";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { PageType } from "@/shared/enum/PageType";
import { GeneralPageState } from "@/shared/enum/GeneralPageState";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";
import { useServices } from "@/context/ServiceContext";
import SelectFolderModal from "@/components/ui/SelectFolderModal/SelectFolderModal";
import { EnrichedError, ServiceErrorType } from "@/shared/error/ServiceError";
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

export default function HomeScreen() {
  const { generalPageService, tagService } = useServices();

  const colorScheme = useActiveColorScheme();
  const color = Colors[colorScheme || "light"].tint;
  const { width } = useWindowDimensions();
  const columns = width >= 768 ? 3 : 2;
  const router = useRouter();

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [tags, setTags] = useState<TagDTO[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [sortingMode, setSortingMode] = useState<GeneralPageState>(
    GeneralPageState.GeneralModfied,
  );
  const [errors, setErrors] = useState<EnrichedError[]>([]);
  const [showError, setShowError] = useState(false);
  const [completedWithError, setCompletedWithError] = useState(false);

  const [showFolderSelectionModal, setShowFolderSelectionModal] =
    useState(false);

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
      color:
        getColorKeyFromValue(widget.page_color || Colors.primary) ??
        Colors.primary,
      page_type: widget.page_type,
      icon: widget.page_icon ? getMaterialIcon(widget.page_icon) : undefined,
      archived: widget.archived,
      pinned: widget.pinned,
    }));
  };

  useFocusEffect(
    useCallback(() => {
      const fetchWidgets = async () => {
        try {
          const pinnedResult = await generalPageService.getAllGeneralPageData(
            GeneralPageState.Pinned,
          );

          if (pinnedResult.success) {
            setPinnedWidgets(mapToEnrichedWidgets(pinnedResult.value));

            // remove all prior errors from the pinned widget source
            setErrors((prev) =>
              prev.filter((error) => error.source !== "widgets:pinned"),
            );
          } else {
            // set the errors to the previous errors plus add the new error
            // define the id and the source and set its read status to false
            setErrors((prev) => [
              ...prev,
              {
                ...pinnedResult.error,
                hasBeenRead: false,
                id: `${Date.now()}-${Math.random()}`,
                source: "widgets:pinned",
              },
            ]);
            setShowError(true);
          }

          const widgetResult =
            await generalPageService.getAllGeneralPageData(sortingMode);
          if (widgetResult.success) {
            setWidgets(mapToEnrichedWidgets(widgetResult.value));
            setCompletedWithError(false);

            // remove all prior errors from the general sorting mode source
            setErrors((prev) =>
              prev.filter((error) => error.source !== "widgets:general"),
            );
          } else {
            // set the errors to the previous errors plus add the new error
            // define the id and the source and set its read status to false
            setErrors((prev) => [
              ...prev,
              {
                ...widgetResult.error,
                hasBeenRead: false,
                id: `${Date.now()}-${Math.random()}`,
                source: "widgets:general",
              },
            ]);
            setShowError(true);
            setCompletedWithError(true);
          }
        } catch (error) {
          console.error("Error loading widgets:", error);
        }
      };

      fetchWidgets();
      setShouldReload(false);
    }, [shouldReload, sortingMode]),
  );

  useFocusEffect(
    useCallback(() => {
      const fetchTags = async () => {
        try {
          const tagResult = await tagService.getAllTags();
          if (tagResult.success) {
            setTags(tagResult.value);

            // remove all prior errors from the general tag retrieval source
            setErrors((prev) =>
              prev.filter((error) => error.source !== "tags:retrieval"),
            );
          } else {
            // set the errors to the previous errors plus add the new error
            // define the id and the source and set its read status to false
            setErrors((prev) => [
              ...prev,
              {
                ...tagResult.error,
                hasBeenRead: false,
                id: `${Date.now()}-${Math.random()}`,
                source: "tags:retrieval",
              },
            ]);
            setShowError(true);
          }
        } catch (error) {
          console.error("Failed to load tags:", error);
        }
      };

      fetchTags();
    }, []),
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
        <ThemedView>
          <IconTopRight onPress={() => router.push({ pathname: "/faq" })}>
            <Image
              source={require("@/assets/images/kriz.png")}
              style={{ width: 30, height: 32 }}
            />
          </IconTopRight>

          <ThemedText fontSize="xl" fontWeight="bold">
            Home
          </ThemedText>

          {widgets.length === 0 &&
          pinnedWidgets.length === 0 &&
          !completedWithError ? (
            <EmptyHome
              text="Add your first note/collection"
              buttonLabel="Start"
              useModal={false}
              onButtonPress={() => setModalVisible(true)}
            />
          ) : (
            <>
              <SearchBar
                placeholder="Search for title"
                onSearch={setSearchQuery}
              />
              <TagList
                tags={tags}
                onSelect={(tag) => setSelectedTag(tag)}
                onPress={() => router.push("/tagManagement")}
              />

              <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
              >
                {filteredPinnedWidgets.length > 0 && (
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
                        Pinned
                      </ThemedText>
                      <ThemedText
                        fontSize="s"
                        fontWeight="regular"
                        colorVariant="greyScale"
                      >
                        {pinnedWidgets.length} out of 4
                      </ThemedText>
                    </View>

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
                            setShowModal(true);
                          }}
                        />
                      ))}
                    </View>
                  </>
                )}

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
                        <ThemedText
                          fontSize="s"
                          fontWeight="regular"
                          colorVariant="greyScale"
                        >
                          Sort by
                        </ThemedText>
                        <MaterialIcons
                          name="filter-list"
                          size={20}
                          color={
                            Colors[colorScheme || "light"].searchBarPlaceholder
                          }
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
                          setShowModal(true);
                        }}
                      />
                    ))}
                  </View>
                </>

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
            icon: "swap-vert", // or "arrow-upward"/"arrow-downward"
            disabled: sortingMode === GeneralPageState.GeneralModfied,
            onPress: () => {
              setSortingMode(GeneralPageState.GeneralModfied);
              setShowSortModal(false);
            },
          },
          {
            label: "Alphabet ascending",
            icon: "sort-by-alpha",
            disabled: sortingMode === GeneralPageState.GeneralAlphabet,
            onPress: () => {
              setSortingMode(GeneralPageState.GeneralAlphabet);
              setShowSortModal(false);
            },
          },
          {
            label: "Created ascending",
            icon: "sort",
            disabled: sortingMode === GeneralPageState.GeneralCreated,
            onPress: () => {
              setSortingMode(GeneralPageState.GeneralCreated);
              setShowSortModal(false);
            },
          },
        ]}
      />

      <QuickActionModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        items={[
          {
            label: selectedWidget?.pinned ? "Unpin Widget" : "Pin Widget",
            icon: "push-pin",
            disabled: !selectedWidget?.pinned && pinnedWidgets.length >= 4,
            onPress: async () => {
              if (
                (selectedWidget &&
                  !selectedWidget.pinned &&
                  pinnedWidgets.length < 4) ||
                (selectedWidget && selectedWidget?.pinned)
              ) {
                const result = await generalPageService.togglePagePin(
                  Number(selectedWidget.id),
                  selectedWidget.pinned,
                );
                if (result.success) {
                  setShouldReload(true);

                  // remove all prior errors from the pinning source
                  setErrors((prev) =>
                    prev.filter((error) => error.source !== "pinning"),
                  );
                } else {
                  // set the errors to the previous errors plus add the new error
                  // define the id and the source and set its read status to false
                  setErrors((prev) => [
                    ...prev,
                    {
                      ...result.error,
                      hasBeenRead: false,
                      id: `${Date.now()}-${Math.random()}`,
                      source: "pinning",
                    },
                  ]);
                  setShowError(true);
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
                const result = await generalPageService.togglePageArchive(
                  Number(selectedWidget.id),
                  selectedWidget.archived,
                );
                if (result.success) {
                  showSnackbar(
                    `Successfully moved ${selectedWidget.page_type === "note" ? "Note" : "Collection"} to Archive in Menu.`,
                    "bottom",
                    "success",
                  );
                  setShouldReload(true);

                  // remove all prior errors from the archiving source
                  setErrors((prev) =>
                    prev.filter((error) => error.source !== "archiving"),
                  );
                } else {
                  // set all errors to the previous errors plus add the new error
                  // define the id and the source and set its read status to false
                  setErrors((prev) => [
                    ...prev,
                    {
                      ...result.error,
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
              }
            },
          },
          {
            label: "Move to Folder",
            icon: "folder",
            onPress: () => setShowFolderSelectionModal(true),
          },
          {
            label: "Delete",
            icon: "delete",
            onPress: () => {
              setShowModal(false); // close the QuickActionModal

              if (Platform.OS === "ios") {
                setTimeout(() => {
                  setShowDeleteModal(true);
                }, 300); // match iOS fade-out duration
              } else {
                setShowDeleteModal(true); // no delay on Android
              }
            },
            danger: true,
          },
        ]}
      />

      <ModalSelection
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />

      <SelectFolderModal
        widgetTitle={selectedWidget?.title}
        widgetId={selectedWidget?.id}
        onClose={() => setShowFolderSelectionModal(false)}
        visible={showFolderSelectionModal}
        onMoved={(success) => {
          if (success) {
            setShouldReload(true);
          }
          setShowFolderSelectionModal(false);
        }}
      />

      <DeleteModal
        visible={showDeleteModal}
        title={selectedWidget?.title}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (selectedWidget) {
            try {
              const result = await generalPageService.deleteGeneralPage(
                Number(selectedWidget.id),
              );

              if (result.success) {
                setShouldReload(true);

                // remove all prior errors from the widget delete source
                setErrors((prev) =>
                  prev.filter((error) => error.source !== "widget:delete"),
                );
              } else {
                // set all errors to the previous errors plus add the new error
                // define the id and the source and set its read status to false
                setErrors((prev) => [
                  ...prev,
                  {
                    ...result.error,
                    hasBeenRead: false,
                    id: `${Date.now()}-${Math.random()}`,
                    source: "widget:delete",
                  },
                ]);
                setShowError(true);
              }
              setSelectedWidget(null);
              setShowDeleteModal(false);
            } catch (error) {
              console.error("Error deleting page:", error);
            }
          }
        }}
        onclose={() => setShowDeleteModal(false)}
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
