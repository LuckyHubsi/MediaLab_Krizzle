import { FlatList, Image } from "react-native";
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
import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { resetDatabase } from "@/utils/DatabaseReset";
import { Button } from "@/components/ui/Button/Button";
import { TagDTO } from "@/dto/TagDTO";
import { getAllTags } from "@/services/TagService";
import { ModalSelection } from "@/components/Modals/CreateNCModal/CreateNCModal";
import { GeneralPageState } from "@/utils/enums/GeneralPageState";

export const getMaterialIcon = (name: string, size = 20, color = "black") => {
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
  const colorScheme = useColorScheme();
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

  const [shouldReload, setShouldReload] = useState<boolean>(false);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedTag, setSelectedTag] = useState<TagDTO | "All">("All");
  const [pinnedWidgets, setPinnedWidgets] = useState<Widget[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [tags, setTags] = useState<TagDTO[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);

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

  const mapToEnrichedWidgets = (data: GeneralPageDTO[] | null): Widget[] => {
    if (data == null) {
      return [];
    } else {
      const enrichedWidgets: Widget[] = (data || []).map((widget) => ({
        id: String(widget.pageID),
        title: widget.page_title,
        tag: widget.tag || { tag_label: "Uncategorized" },
        color:
          getColorKeyFromValue(widget.page_color || "#4599E8") ?? "#4599E8",
        page_type: widget.page_type,
        iconLeft: widget.page_icon
          ? getMaterialIcon(widget.page_icon)
          : undefined,
        iconRight: widget.page_type
          ? getIconForPageType(widget.page_type)
          : undefined,
        archived: widget.archived,
        pinned: widget.pinned,
      }));

      return enrichedWidgets;
    }
  };

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const pinnedData = await getAllGeneralPageData(
            GeneralPageState.Pinned,
          );
          const pinnedEnrichedWidgets: Widget[] =
            mapToEnrichedWidgets(pinnedData);
          setPinnedWidgets(pinnedEnrichedWidgets);

          const data = await getAllGeneralPageData(GeneralPageState.General);
          const enrichedWidgets: Widget[] = mapToEnrichedWidgets(data);
          setWidgets(enrichedWidgets);
        } catch (error) {
          console.error("Error loading widgets:", error);
        }
      })();

      const fetchTags = async () => {
        try {
          const tagData = await getAllTags();
          if (tagData) setTags(tagData);
        } catch (error) {
          console.error("Failed to load tags:", error);
        }
      };

      fetchTags();
      setShouldReload(false);
    }, [shouldReload]),
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

  const filteredWidgets = useMemo(() => {
    return filter(widgets);
  }, [widgets, selectedTag, searchQuery]);

  const filteredPinnedWidgets = useMemo(() => {
    return filter(pinnedWidgets);
  }, [pinnedWidgets, selectedTag, searchQuery]);

  const goToPage = (widget: Widget) => {
    const path =
      widget.page_type === PageType.Note ? "/notePage" : "/collectionPage";

    router.push({
      pathname: path,
      params: { pageId: widget.id, title: widget.title },
    });
  };

  const goToEditPage = (widget: Widget) => {
    const path = "/editWidget";

    router.push({
      pathname: path,
      params: { widgetID: widget.id },
    });
  };

  const widgetDisplay = (headline: string, data: Widget[]): React.ReactNode => {
    return (
      <>
        <ThemedText fontSize="regular" fontWeight="regular">
          {headline}
        </ThemedText>

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          numColumns={columns}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 16,
          }}
          renderItem={({ item }) => (
            <Widget
              title={item.title}
              label={item.tag.tag_label}
              iconLeft={item.iconLeft}
              iconRight={item.iconRight}
              color={item.color as keyof typeof Colors.widget}
              pageType={item.page_type}
              onPress={() => goToPage(item)}
              onLongPress={() => {
                setSelectedWidget(item);
                setShowModal(true);
              }}
            />
          )}
        />
      </>
    );
  };

  return (
    <>
      <SafeAreaView>
        <ThemedView>
          <IconTopRight>
            <Image
              source={require("@/assets/images/kriz.png")}
              style={{ width: 30, height: 32 }}
            />
          </IconTopRight>

          <ThemedText fontSize="xl" fontWeight="bold">
            Home
          </ThemedText>

          {widgets.length === 0 && pinnedWidgets.length === 0 ? (
            <EmptyHome
              text="Add your first note/collection"
              buttonLabel="Start"
              useModal={false}
              onButtonPress={() => setModalVisible(true)}
            />
          ) : (
            <>
              <SearchBar
                placeholder="Search"
                onSearch={(query) => setSearchQuery(query)}
              />

              <TagList
                tags={tags}
                onSelect={(tag) => setSelectedTag(tag)}
                onPress={() => {
                  router.push("/tagManagement");
                }}
              />

              {filteredPinnedWidgets.length > 0 &&
                widgetDisplay("Pinned", filteredPinnedWidgets)}
              {filteredWidgets.length > 0 &&
                widgetDisplay("Recent", filteredWidgets)}

              {filteredPinnedWidgets.length <= 0 &&
              filteredWidgets.length <= 0 ? (
                <ThemedText
                  fontSize="regular"
                  fontWeight="regular"
                  style={{ textAlign: "center", marginTop: 25 }}
                >
                  {selectedTag === "All" && !searchQuery
                    ? "No entries found."
                    : `No entries for "${selectedTag !== "All" ? selectedTag.tag_label : searchQuery}"`}
                </ThemedText>
              ) : null}
            </>
          )}
        </ThemedView>
      </SafeAreaView>
      <QuickActionModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        items={[
          {
            label: selectedWidget?.pinned ? "Unpin Widget" : "Pin Widget",
            icon: "push-pin",
            onPress: async () => {
              if (
                (selectedWidget &&
                  !selectedWidget.pinned &&
                  pinnedWidgets.length < 4) ||
                (selectedWidget && selectedWidget?.pinned)
              ) {
                const success = await togglePagePin(
                  Number(selectedWidget.id),
                  selectedWidget.pinned,
                );
                setShouldReload(success);
              }
            },
          },
          {
            label: "Edit Widget",
            icon: "edit",
            onPress: () => {
              if (selectedWidget) {
                goToEditPage(selectedWidget);
              }
            },
          },
          {
            label: "Archive",
            icon: "archive",
            onPress: async () => {
              if (selectedWidget) {
                const success = await togglePageArchive(
                  Number(selectedWidget.id),
                  selectedWidget.archived,
                );
                setShouldReload(success);
              }
            },
          },
          {
            label: "Delete",
            icon: "delete",
            onPress: () => {
              setShowDeleteModal(true);
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
        visible={showDeleteModal}
        title={selectedWidget?.title}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (selectedWidget) {
            try {
              const widgetIdAsNumber = Number(selectedWidget.id);
              const successfullyDeleted =
                await deleteGeneralPage(widgetIdAsNumber);

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
