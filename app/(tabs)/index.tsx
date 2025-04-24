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
import { Button } from "@/components/ui/Button/Button";
import { resetDatabase } from "@/utils/DatabaseReset";
import {
  deleteGeneralPage,
  getAllGeneralPageData,
} from "@/services/GeneralPageService";
import { useFocusEffect } from "@react-navigation/native";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import { GeneralPageDTO } from "@/dto/GeneralPageDTO";
import { useRouter } from "expo-router";

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
    page_type?: string;
    color?: string;
    [key: string]: any;
  }

  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [widgetToDelete, setWidgetToDelete] = useState<Widget | null>(null);

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
          const data = await getAllGeneralPageData();

          const enrichedWidgets: Widget[] = mapToEnrichedWidgets(data);

          setWidgets(enrichedWidgets);
        } catch (error) {
          console.error("Error loading widgets:", error);
        }
      };

      fetchWidgets();
    }, []),
  );

  const filteredWidgets = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return widgets.filter((widget) => {
      const matchesTag = selectedTag === "All" || widget.tag === selectedTag;
      const matchesTitle = widget.title.toLowerCase().includes(lowerQuery);
      return matchesTag && matchesTitle;
    });
  }, [widgets, selectedTag, searchQuery]);

  useEffect(() => {
    console.log("All widgets:", widgets);
  }, [widgets]);

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
            <EmptyHome />
          ) : (
            <>
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
                        onPress={() => {
                          router.push({
                            pathname: "/notePage",
                            params: { id: item.id, title: item.title },
                          });
                        }}
                        onLongPress={() => {
                          setWidgetToDelete(item);
                          setShowDeleteModal(true);
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
      <DeleteModal
        visible={showDeleteModal}
        title={widgetToDelete?.title}
        typeToDelete="widget"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (widgetToDelete) {
            try {
              const widgetIdAsNumber = Number(widgetToDelete.id);
              const successfullyDeleted =
                await deleteGeneralPage(widgetIdAsNumber);

              const data = await getAllGeneralPageData();
              const enrichedWidgets: Widget[] = mapToEnrichedWidgets(data);
              setWidgets(enrichedWidgets);

              setWidgetToDelete(null);
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
