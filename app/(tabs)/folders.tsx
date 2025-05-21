import { FlatList, Image, Platform, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import Widget from "@/components/ui/Widget/Widget";
import { MaterialIcons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import { EmptyHome } from "@/components/emptyHome/emptyHome";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import { useRouter } from "expo-router";
import QuickActionModal from "@/components/Modals/QuickActionModal/QuickActionModal";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";
import FolderComponent from "@/components/ui/FolderComponent/FolderComponent";
import { PageType } from "@/shared/enum/PageType";
import { GeneralPageDTO } from "@/shared/dto/GeneralPageDTO";
import { generalPageService } from "@/backend/service/GeneralPageService";
import { GeneralPageState } from "@/shared/enum/GeneralPageState";
import { IconTopRight } from "@/components/ui/IconTopRight/IconTopRight";

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
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme || "light"].tint;
  const { width } = useWindowDimensions();
  const columns = width >= 768 ? 3 : 2;

  const router = useRouter();

  // interface ArchivedWidget {
  //   id: string;
  //   title: string;
  //   tag: string;
  //   page_icon?: string;
  //   page_type: PageType;
  //   color?: string;
  //   archived: boolean;
  //   [key: string]: any;
  // }

  const [shouldReload, setShouldReload] = useState<boolean>(false);
  // const [widgets, setWidgets] = useState<ArchivedWidget[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // const [selectedWidget, setSelectedWidget] = useState<ArchivedWidget | null>(
  //   null,
  // );

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

  interface Folder {
    id: string;
    title: string;
    itemCount: number;
  }

  const hardcodedFolders: Folder[] = [
    { id: "1", title: "Folder 1", itemCount: 5 },
    { id: "2", title: "Folder 2", itemCount: 10 },
    { id: "3", title: "Folder 3", itemCount: 8 },
    { id: "4", title: "Folder 4", itemCount: 12 },
    { id: "5", title: "Folder 5", itemCount: 7 },
    { id: "6", title: "Folder 6", itemCount: 15 },
    { id: "7", title: "Folder 6", itemCount: 15 },
    { id: "8", title: "Folder 6", itemCount: 15 },
    { id: "9", title: "Folder 6", itemCount: 15 },
    { id: "10", title: "Folder 6", itemCount: 15 },
    { id: "11", title: "Folder 6", itemCount: 15 },
    { id: "12", title: "Folder 6", itemCount: 15 },
    { id: "13", title: "Folder 6", itemCount: 15 },
    { id: "14", title: "Folder 6", itemCount: 15 },
    { id: "15", title: "Folder 6", itemCount: 15 },
  ];

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

          {hardcodedFolders.length === 0 ? (
            <EmptyHome text="No folders yet" showButton={false} />
          ) : (
            <>
              <SearchBar
                placeholder="Search"
                onSearch={(query) => setSearchQuery(query)}
              />

              {/* {filteredWidgets.length > 0 ? ( */}
              {/* <> */}
              <FlatList
                data={hardcodedFolders}
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
      <DeleteModal
        visible={showDeleteModal}
        title={selectedFolder?.title}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (selectedFolder) {
            try {
              const widgetIdAsNumber = Number(selectedFolder.id);
              const successfullyDeleted =
                await generalPageService.deleteGeneralPage(widgetIdAsNumber);

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
    </>
  );
}
