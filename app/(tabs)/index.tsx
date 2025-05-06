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
} from "@/services/GeneralPageService";
import { useFocusEffect } from "@react-navigation/native";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import { GeneralPageDTO } from "@/dto/GeneralPageDTO";
import { useRouter } from "expo-router";
import { PageType } from "@/utils/enums/PageType";
import QuickActionModal from "@/components/Modals/QuickActionModal/QuickActionModal";
import { ModalSelection } from "@/components/Modals/CreateNCModal/CreateNCModal";
import { ScreenType } from "@/utils/enums/ScreenType";

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
    tag: string;
    page_icon?: string;
    page_type: PageType;
    color?: string;
    [key: string]: any;
  }

  const [shouldReload, setShouldReload] = useState<boolean>(false);
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
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
        tag: widget.tag?.tag_label || "Uncategorized",
        color: getColorKeyFromValue(widget.page_color || "#4599E8") ?? "blue",
        page_type: widget.page_type,
        iconLeft: widget.page_icon
          ? getMaterialIcon(widget.page_icon)
          : undefined,
        iconRight: widget.page_type
          ? getIconForPageType(widget.page_type)
          : undefined,
      }));

      return enrichedWidgets;
    }
  };

  useFocusEffect(
    useCallback(() => {
      const fetchWidgets = async () => {
        try {
          const data = await getAllGeneralPageData(ScreenType.Home);

          const enrichedWidgets: Widget[] = mapToEnrichedWidgets(data);

          setWidgets(enrichedWidgets);
        } catch (error) {
          console.error("Error loading widgets:", error);
        }
      };

      setShouldReload(false);
      fetchWidgets();
    }, [shouldReload]),
  );

  const filteredWidgets = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return widgets.filter((widget) => {
      const matchesTag = selectedTag === "All" || widget.tag === selectedTag;
      const matchesTitle = widget.title.toLowerCase().includes(lowerQuery);
      return matchesTag && matchesTitle;
    });
  }, [widgets, selectedTag, searchQuery]);

  useEffect(() => {}, [widgets]);

  const goToPage = (widget: Widget) => {
    const path =
      widget.page_type === PageType.Note ? "/notePage" : "/collectionPage";

    router.push({
      pathname: path,
      params: { pageId: widget.id, title: widget.title },
    });
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

          {widgets.length === 0 ? (
            <EmptyHome
              text="Add your first note/collection"
              buttonLabel="Start"
              useModal={false}
              onButtonPress={() => setModalVisible(true)}
            />
          ) : (
            <>
              {/* <Button onPress={resetDatabase}>reset all</Button> */}
              <SearchBar
                placeholder="Search"
                onSearch={(query) => setSearchQuery(query)}
              />

              <TagList
                tags={["All", "Books", "Cafés", "Lists", "To-Dos"]}
                onSelect={(tag) => setSelectedTag(tag)}
              />

              {filteredWidgets.length > 0 ? (
                <>
                  <ThemedText fontSize="regular" fontWeight="regular">
                    Recent
                  </ThemedText>

                  <FlatList
                    data={filteredWidgets}
                    keyExtractor={(item) => item.id}
                    numColumns={columns}
                    columnWrapperStyle={{
                      justifyContent: "space-between",
                      marginBottom: 16,
                    }}
                    renderItem={({ item }) => (
                      <Widget
                        title={item.title}
                        label={item.tag}
                        iconLeft={item.iconLeft}
                        iconRight={item.iconRight}
                        color={item.color as keyof typeof Colors.widget}
                        pageType={item.page_type}
                        onPress={() => {
                          goToPage(item);
                        }}
                        onLongPress={() => {
                          setSelectedWidget(item);
                          setShowModal(true);
                        }}
                      />
                    )}
                  />
                </>
              ) : (
                <ThemedText
                  fontSize="regular"
                  fontWeight="regular"
                  style={{ textAlign: "center", marginTop: 25 }}
                >
                  {selectedTag === "All" && !searchQuery
                    ? "No entries found."
                    : `No entries for "${selectedTag !== "All" ? selectedTag : searchQuery}"`}
                </ThemedText>
              )}
            </>
          )}
        </ThemedView>
      </SafeAreaView>
      <QuickActionModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        items={[
          { label: "Pin item", icon: "push-pin", onPress: () => {} },
          { label: "Edit", icon: "edit", onPress: () => {} },
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
        typeToDelete="widget"
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
