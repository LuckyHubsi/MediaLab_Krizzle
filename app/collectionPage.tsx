import React, { useCallback, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Platform } from "react-native";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import { FloatingAddButton } from "@/components/ui/NavBar/FloatingAddButton/FloatingAddButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CollectionDTO } from "@/shared/dto/CollectionDTO";
import { ItemsDTO } from "@/shared/dto/ItemsDTO";
import QuickActionModal, {
  QuickActionItem,
} from "@/components/Modals/QuickActionModal/QuickActionModal";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import { PreviewItemDTO } from "@/shared/dto/ItemDTO";
import { ThemedText } from "@/components/ThemedText";
import { useFocusEffect } from "@react-navigation/native";
import { CollectionListCard } from "@/components/ui/CollectionListCard/CollectionListCard";
import { GradientBackgroundWrapper } from "@/components/ui/GradientBackground/GradientBackground.styles";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";
import { useServices } from "@/context/ServiceContext";
import SelectFolderModal from "@/components/ui/SelectFolderModal/SelectFolderModal";

export default function CollectionScreen() {
  const { generalPageService, collectionService } = useServices();

  const router = useRouter();
  const { pageId, title, selectedIcon, routing } = useLocalSearchParams<{
    pageId: string;
    title?: string;
    selectedIcon?: keyof typeof MaterialIcons.glyphMap;
    routing?: string;
  }>();

  const { showSnackbar } = useSnackbar();

  const [collection, setCollection] = useState<CollectionDTO>();
  const [listNames, setListNames] = useState<string[]>([]);
  const [items, setItems] = useState<ItemsDTO>();
  const [showModal, setShowModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showItemDeleteModal, setShowItemDeleteModal] = useState(false);
  const [shouldReload, setShouldReload] = useState<boolean>();
  const [selectedItem, setSelectedItem] = useState<PreviewItemDTO>();
  const [selectedList, setSelectedList] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFolderSelectionModal, setShowFolderSelectionModal] =
    useState(false);
  const [collectionTitle, setCollectionTitle] = useState<string>(title || "");

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const numericID = Number(pageId);
        if (!isNaN(numericID)) {
          const result =
            await collectionService.getCollectionByPageId(numericID);
          if (result.success) {
            setCollection(result.value);
            setCollectionTitle(title || result.value.page_title);

            if (result.value.categories) {
              const names = result.value.categories.map((c) => c.category_name);
              setListNames(names);
              setSelectedList(names[0]); // ✅ set selected list directly here
            }
            const retrievedItemsResult =
              await collectionService.getItemsByPageId(numericID);
            if (retrievedItemsResult.success) {
              setItems(retrievedItemsResult.value);
            }
          } else {
            // TODO: show error modal
          }
          setShouldReload(false);
        }
      })();
    }, [pageId, shouldReload]),
  );

  const goToEditPage = () => {
    const path = "/editWidget";

    router.push({
      pathname: path,
      params: { widgetID: pageId },
    });
  };

  const goToEditListsPage = () => {
    const path = "/editCollectionLists";

    router.push({
      pathname: path,
      params: { collectionId: collection?.collectionID },
    });
  };

  const filteredItems = useMemo(() => {
    if (!items || !items.items || !items.attributes) return []; // Return an empty array if items or attributes are undefined

    const lowerQuery = searchQuery.toLowerCase();

    return items.items.filter((item) => {
      const category = item.categoryName;

      const matchesList = category === selectedList;

      const matchesTitle = item.values
        .join(" ")
        .toLowerCase()
        .includes(lowerQuery);

      return matchesList && matchesTitle;
    });
  }, [items, selectedList, searchQuery]);

  return (
    <>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "transparent", gap: 12 }}
      >
        <GradientBackgroundWrapper
          colors={["#4599E8", "#583FE7"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
          }}
        />
        <CustomStyledHeader
          title={collectionTitle || "Collection"}
          backBehavior="goHome"
          iconName={selectedIcon || undefined}
          onIconPress={() => {}}
          iconName2="more-horiz"
          onIconMenuPress={() => setShowModal(true)}
          leftIconName={
            collection?.page_icon as keyof typeof MaterialIcons.glyphMap
          }
          isTransparent={true}
        />

        <View style={{ paddingHorizontal: 20 }}>
          <SearchBar
            placeholder="Search"
            onSearch={(text) => setSearchQuery(text)}
          />
        </View>

        <CollectionListCard
          collectionLists={listNames}
          listNames={listNames}
          setSelectedList={setSelectedList}
          onSelect={(collectionList) => {
            if (setSelectedList && collectionList) {
              if (collectionList !== selectedList) {
                setSelectedList(collectionList);
              }
            }
          }}
          filteredItems={filteredItems}
          items={items}
          setSelectedItem={setSelectedItem}
          setShowItemModal={setShowItemModal}
          searchQuery={searchQuery}
        />
      </SafeAreaView>

      <QuickActionModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        items={
          [
            collection && !collection.archived
              ? {
                  label: collection?.pinned ? "Unpin Widget" : "Pin Widget",
                  icon: "push-pin",
                  disabled:
                    !collection?.pinned && (collection?.pin_count ?? 0) >= 4,
                  onPress: async () => {
                    if (
                      (collection &&
                        !collection.pinned &&
                        collection.pin_count != null &&
                        collection.pin_count < 4) ||
                      (collection && collection?.pinned)
                    ) {
                      const result = await generalPageService.togglePagePin(
                        Number(collection.pageID),
                        collection.pinned,
                      );
                      if (result.success) {
                        setShouldReload(true);
                      } else {
                        // TODO: show error modal
                      }
                    }
                  },
                }
              : null,
            collection && !collection.archived
              ? {
                  label: "Edit Widget",
                  icon: "edit",
                  onPress: () => {
                    goToEditPage();
                  },
                }
              : null,
            collection && !collection.archived
              ? {
                  label: "Edit Lists",
                  icon: "edit-note",
                  onPress: () => {
                    goToEditListsPage();
                  },
                }
              : null,
            {
              label: collection?.archived ? "Restore" : "Archive",
              icon: collection?.archived ? "restore" : "archive",

              onPress: async () => {
                if (collection) {
                  const result = await generalPageService.togglePageArchive(
                    Number(pageId),
                    collection.archived,
                  );
                  if (result.success) {
                    showSnackbar(
                      collection.archived
                        ? "Successfully restored Collection."
                        : "Successfully archived Collection.",
                      "bottom",
                      "success",
                    );
                    setShouldReload(true);
                  } else {
                    // TODO: show error modal
                    showSnackbar(
                      collection.archived
                        ? "Failed to restore Collection."
                        : "Failed to archive Collection.",
                      "bottom",
                      "error",
                    );
                  }
                }
              },
            },
            collection && !collection.archived
              ? {
                  label: "Move to Folder",
                  icon: "folder",
                  onPress: () => {
                    setShowFolderSelectionModal(true);
                  },
                }
              : null,
            {
              label: "Delete",
              icon: "delete",
              onPress: () => {
                setShowDeleteModal(true);
              },
              danger: true,
            },
          ].filter(Boolean) as QuickActionItem[]
        }
      />
      <QuickActionModal
        visible={showItemModal}
        onClose={() => setShowItemModal(false)}
        items={[
          {
            label: "Edit Item",
            icon: "edit",
            onPress: () => {
              router.push({
                pathname: "/editCollectionItem",
                params: { itemId: selectedItem?.itemID },
              });
            },
          },

          {
            label: "Delete",
            icon: "delete",
            onPress: () => {
              setShowModal(false);

              if (Platform.OS === "ios") {
                setTimeout(() => {
                  setShowItemDeleteModal(true);
                }, 300);
              } else {
                setShowItemDeleteModal(true);
              }
            },
            danger: true,
          },
        ]}
      />
      <DeleteModal
        visible={showDeleteModal}
        title={title}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (pageId) {
            try {
              const widgetIdAsNumber = Number(pageId);
              const result =
                await generalPageService.deleteGeneralPage(widgetIdAsNumber);

              if (result.success) {
                setShowDeleteModal(false);
              } else {
                // TODO: show error modal
              }
              router.replace("/");
            } catch (error) {
              console.error("Error deleting collection:", error);
            }
          }
        }}
        onclose={() => setShowDeleteModal(false)}
      />
      <DeleteModal
        visible={showItemDeleteModal}
        title={selectedItem?.values[0]?.toString() || ""}
        onCancel={() => setShowItemDeleteModal(false)}
        onConfirm={async () => {
          if (selectedItem) {
            try {
              const itemIdAsNumber = Number(selectedItem.itemID);
              const deleteResult =
                await collectionService.deleteItemById(itemIdAsNumber);

              if (deleteResult.success) {
                setShowItemDeleteModal(false);
                setShouldReload(true);
                showSnackbar("Successfully deleted Item.", "bottom", "success");
              } else {
                // TODO: show error modal
              }
            } catch (error) {
              console.error("Error deleting item:", error);
            }
          }
        }}
        onclose={() => setShowItemDeleteModal(false)}
      />

      <View
        style={{
          position: "absolute",
          right: 20,
          bottom: 30,
        }}
      >
        <FloatingAddButton
          onPress={() => {
            router.push({
              pathname: "/addCollectionItem",
              params: {
                templateId: collection?.templateID?.toString(),
                collectionId: collection?.collectionID?.toString(),
                pageId: pageId,
              },
            });
          }}
        />
      </View>
      <SelectFolderModal
        widgetTitle={title}
        onClose={() => setShowFolderSelectionModal(false)}
        visible={showFolderSelectionModal}
      />
    </>
  );
}
