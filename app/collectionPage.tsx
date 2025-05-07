import React, { useCallback, useEffect, useState } from "react";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, ScrollView } from "react-native";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import { FloatingAddButton } from "@/components/ui/NavBar/FloatingAddButton/FloatingAddButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CollectionWidget from "@/components/ui/CollectionWidget/CollectionWidget";
import CollectionList from "@/components/ui/CollectionList/CollectionList";
import { getCollectionByPageId } from "@/services/CollectionService";
import { CollectionDTO } from "@/dto/CollectionDTO";
import { template } from "@babel/core";
import {
  CollectionSelectable,
  CollectionTitle,
} from "@/components/ui/CollectionWidget/CollectionWidget.style";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ItemsDTO } from "@/dto/ItemsDTO";
import { deleteItemById, getItemsByPageId } from "@/services/ItemService";
import QuickActionModal from "@/components/Modals/QuickActionModal/QuickActionModal";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import {
  deleteGeneralPage,
  togglePageArchive,
  togglePagePin,
} from "@/services/GeneralPageService";
import { PreviewItemDTO } from "@/dto/ItemDTO";
import { ThemedText } from "@/components/ThemedText";

export default function CollectionScreen() {
  const router = useRouter();
  const { pageId, title, selectedIcon } = useLocalSearchParams<{
    pageId: string;
    title?: string;
    selectedIcon?: keyof typeof MaterialIcons.glyphMap;
  }>();

  const [collection, setCollection] = useState<CollectionDTO>();
  const [listNames, setListNames] = useState<string[]>([]);
  const [items, setItems] = useState<ItemsDTO>();
  const [showModal, setShowModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showItemDeleteModal, setShowItemDeleteModal] = useState(false);
  const [shouldReload, setShouldReload] = useState<boolean>();
  const [selectedItem, setSelectedItem] = useState<PreviewItemDTO>();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const numericID = Number(pageId);
        if (!isNaN(numericID)) {
          const collectionData = await getCollectionByPageId(numericID);
          if (collectionData) {
            setCollection(collectionData);
            if (collectionData.categories) {
              const listNames = [];
              for (const list of collectionData.categories) {
                listNames.push(list.category_name);
              }
              setListNames(listNames);
            }
          }
          const retrievedItems: ItemsDTO = await getItemsByPageId(numericID);
          if (retrievedItems) setItems(retrievedItems);
        }
        setShouldReload(false);
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

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomStyledHeader
          title={title || "Collection"} //Here should be the title of the collection
          backBehavior="goHome" // Go back to home when back button is pressed
          iconName={selectedIcon || undefined}
          onIconPress={() => {}} // No action when pressed
          iconName2="more-horiz" // icon for the pop up menu
          onIconMenuPress={() => setShowModal(true)} // action when icon menu is pressed
        />
        <ThemedView topPadding={0}>
          <SearchBar
            placeholder="Search" // Placeholder text for the search bar
            onSearch={(text) => {}}
          />
          <CollectionList
            collectionLists={listNames}
            onPress={() => console.log("Pressed!")}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1, gap: 12 }}>
              {items?.items && items?.items.length ? (
                items.items.map((item) => (
                  <CollectionWidget
                    key={item.itemID}
                    attributes={items.attributes}
                    item={item}
                    onPress={() => {
                      router.push({
                        pathname: "/collectionItemPage",
                        params: { itemId: item.itemID.toString() },
                      });
                    }}
                    onLongPress={() => {
                      setSelectedItem(item);
                      setShowItemModal(true);
                    }}
                  />
                ))
              ) : (
                <ThemedText
                  fontSize="regular"
                  fontWeight="regular"
                  style={{ textAlign: "center", marginTop: 25 }}
                >
                  No collection items found.
                </ThemedText>
              )}
            </View>
          </ScrollView>

          <View
            style={{
              position: "absolute",
              right: 10,
              bottom: 50,
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
              }} // navigate to add collection item screen
            />
          </View>
        </ThemedView>
      </SafeAreaView>
      <QuickActionModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        items={[
          {
            label: collection?.pinned ? "Unpin item" : "Pin item",
            icon: "push-pin",
            onPress: async () => {
              if (
                (collection &&
                  !collection.pinned &&
                  collection.pin_count != null &&
                  collection.pin_count < 4) ||
                (collection && collection?.pinned)
              ) {
                const success = await togglePagePin(
                  Number(collection.pageID),
                  collection.pinned,
                );
                setShouldReload(success);
              }
            },
          },
          {
            label: "Edit Widget",
            icon: "edit",
            onPress: () => {
              goToEditPage();
            },
          },
          { label: "Edit Lists", icon: "edit-note", onPress: () => {} },
          {
            label: collection?.archived ? "Restore" : "Archive",
            icon: collection?.archived ? "restore" : "archive",
            onPress: async () => {
              if (collection) {
                const success = await togglePageArchive(
                  Number(pageId),
                  collection.archived,
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
      <QuickActionModal
        visible={showItemModal}
        onClose={() => setShowItemModal(false)}
        items={[
          { label: "Edit", icon: "edit", onPress: () => {} },

          {
            label: "Delete",
            icon: "delete",
            onPress: () => {
              setShowItemDeleteModal(true);
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
              const successfullyDeleted =
                await deleteGeneralPage(widgetIdAsNumber);
              setShowDeleteModal(false);
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
              const successfullyDeleted = await deleteItemById(itemIdAsNumber);

              setShowItemDeleteModal(false);
              setShouldReload(successfullyDeleted);
            } catch (error) {
              console.error("Error deleting item:", error);
            }
          }
        }}
        onclose={() => setShowItemDeleteModal(false)}
      />
    </>
  );
}
