import {
  ScrollView,
  View,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import Widget from "@/components/ui/Widget/Widget";
import { MaterialIcons } from "@expo/vector-icons";
import TagList from "@/components/ui/TagList/TagList";
import { EmptyHome } from "@/components/emptyHome/emptyHome";
import React, { useState, useMemo, useCallback } from "react";
import { IconTopRight } from "@/components/ui/IconTopRight/IconTopRight";

import {
  deleteGeneralPage,
  getAllGeneralPageData,
  togglePageArchive,
  togglePagePin,
} from "@/services/GeneralPageService";
import { useFocusEffect } from "@react-navigation/native";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import { GeneralPageDTO } from "@/dto/GeneralPageDTO";
import { useRouter } from "expo-router";
import { PageType } from "@/utils/enums/PageType";
import QuickActionModal from "@/components/Modals/QuickActionModal/QuickActionModal";
import { TagDTO } from "@/dto/TagDTO";
import { getAllTags } from "@/services/TagService";
import { ModalSelection } from "@/components/Modals/CreateNCModal/CreateNCModal";
import { GeneralPageState } from "@/utils/enums/GeneralPageState";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { FloatingAddButton } from "@/components/ui/NavBar/FloatingAddButton/FloatingAddButton";

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
  const colorScheme = useActiveColorScheme();
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

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const pinnedData = await getAllGeneralPageData(
            GeneralPageState.Pinned,
          );
          const pinnedEnrichedWidgets = mapToEnrichedWidgets(pinnedData);
          setPinnedWidgets(pinnedEnrichedWidgets);

          const data = await getAllGeneralPageData(sortingMode);
          const enrichedWidgets = mapToEnrichedWidgets(data);
          setWidgets(enrichedWidgets);
        } catch (error) {
          console.error("Error loading widgets:", error);
        }
      })();

      (async () => {
        try {
          const tagData = await getAllTags();
          if (tagData) setTags(tagData);
        } catch (error) {
          console.error("Failed to load tags:", error);
        }
      })();

      setShouldReload(false);
    }, [shouldReload, sortingMode]),
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
        {/* TODO: pass correct foldertitle and backBehavior */}
        <CustomStyledHeader
          title={"Folder Title"}
          iconName="more-horiz"
          //   backBehavior={routing}
          onIconPress={() => setShowModal(true)}
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
                            setShowModal(true);
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
                            setShowModal(true);
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
        ]}
      />

      <QuickActionModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        items={[
          {
            label: "Edit Folder",
            icon: "edit",
            //TODO: Add onPress Logic for editing Folder
            onPress: async () => {},
          },
          {
            label: "Delete",
            icon: "delete",
            onPress: () => setShowDeleteModal(true),
            danger: true,
          },
        ]}
      />

      <ModalSelection
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
      />

      {/* TODO: Add Delete Folder Page Logic */}
      <DeleteModal
        visible={showDeleteModal}
        title={selectedWidget?.title}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (selectedWidget) {
            try {
              const successfullyDeleted = await deleteGeneralPage(
                Number(selectedWidget.id),
              );
              setShouldReload(successfullyDeleted);
              setSelectedWidget(null);
              setShowDeleteModal(false);
            } catch (error) {
              console.error("Error deleting page:", error);
            }
          }
        }}
        onclose={() => setShowDeleteModal(false)}
      />
    </>
  );
}
