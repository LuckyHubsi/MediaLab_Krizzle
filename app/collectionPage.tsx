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
import { EnrichedError } from "@/shared/error/ServiceError";
import { ErrorPopup } from "@/components/Modals/ErrorModal/ErrorModal";

export default function CollectionScreen() {
  const { generalPageService, collectionService, itemTemplateService } =
    useServices();

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

  const [errors, setErrors] = useState<EnrichedError[]>([]);
  const [showError, setShowError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        if (routing === "goArchive") {
          setShouldReload(true);
        }
        const numericID = Number(pageId);
        if (!isNaN(numericID)) {
          const collectionResult =
            await collectionService.getCollectionByPageId(numericID);
          if (collectionResult.success) {
            setCollection(collectionResult.value);
            setCollectionTitle(collectionResult.value.page_title);

            // remove all prior errors from the collection retrieval source if service call succeeded
            setErrors((prev) =>
              prev.filter((error) => error.source !== "collection:retrieval"),
            );
            if (collectionResult.value.categories) {
              const names = collectionResult.value.categories.map(
                (c) => c.category_name,
              );
              setListNames(names);
              setSelectedList(names[0]);
            }
            const retrievedItemsResult =
              await collectionService.getItemsByPageId(numericID);
            if (retrievedItemsResult.success) {
              setItems(retrievedItemsResult.value);

              // remove all prior errors from the items retrieval source if service call succeeded
              setErrors((prev) =>
                prev.filter((error) => error.source !== "items:retrieval"),
              );
            } else {
              // set all errors to the previous errors plus add the new error
              // define the id and the source and set its read status to false
              setErrors((prev) => [
                ...prev,
                {
                  ...retrievedItemsResult.error,
                  hasBeenRead: false,
                  id: `${Date.now()}-${Math.random()}`,
                  source: "items:retrieval",
                },
              ]);
              setShowError(true);
            }
          } else {
            // set all errors to the previous errors plus add the new error
            // define the id and the source and set its read status to false
            setErrors((prev) => [
              ...prev,
              {
                ...collectionResult.error,
                hasBeenRead: false,
                id: `${Date.now()}-${Math.random()}`,
                source: "collection:retrieval",
              },
            ]);
            setShowError(true);
          }
          setShouldReload(false);
        }
      };
      fetchData();
    }, [pageId, shouldReload, routing]),
  );

  const goToEditPage = () => {
    const path = "/editWidget";

    router.push({
      pathname: path,
      params: { widgetID: pageId, routing: routing },
    });
  };

  const goToEditListsPage = () => {
    const path = "/editCollectionLists";

    router.push({
      pathname: path,
      params: {
        collectionId: collection?.collectionID,
        routing: routing,
        pageId: pageId,
      },
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
          backBehavior={routing === "goArchive" ? "goArchive" : "goHome"}
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
            placeholder="Search for item name"
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
          routing={routing}
          collectionId={collection?.collectionID?.toString()}
          isArchived={collection?.archived}
          goToEdit={goToEditListsPage}
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
                      const pinResult = await generalPageService.togglePagePin(
                        Number(collection.pageID),
                        collection.pinned,
                      );
                      if (pinResult.success) {
                        setShouldReload(true);

                        // remove all prior errors from the pinning source if service call succeeded
                        setErrors((prev) =>
                          prev.filter((error) => error.source !== "pinning"),
                        );
                      } else {
                        // set all errors to the previous errors plus add the new error
                        // define the id and the source and set its read status to false
                        setErrors((prev) => [
                          ...prev,
                          {
                            ...pinResult.error,
                            hasBeenRead: false,
                            id: `${Date.now()}-${Math.random()}`,
                            source: "pinning",
                          },
                        ]);
                        setShowError(true);
                        showSnackbar(
                          collection.pinned
                            ? "Failed to unpin Collection."
                            : "Failed to pin Collection.",
                          "bottom",
                          "error",
                        );
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
                  label: "Edit Template",
                  icon: "edit-document",
                  onPress: () => {
                    router.push({
                      pathname: "/editCollectionTemplate",
                      params: {
                        pageId: pageId,
                        templateId: collection?.templateID?.toString(),
                        title: collection?.page_title,
                        routing: routing,
                      },
                    });
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
                  const archiveResult =
                    await generalPageService.togglePageArchive(
                      Number(pageId),
                      collection.archived,
                    );
                  if (archiveResult.success) {
                    showSnackbar(
                      collection.archived
                        ? "Successfully restored Collection."
                        : "Successfully moved Collection to Archive in Menu.",
                      "bottom",
                      "success",
                    );
                    setShouldReload(true);

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
                      collection.archived
                        ? "Failed to restore Collection."
                        : "Failed to move Collection to Archive in Menu.",
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
                params: {
                  itemId: selectedItem?.itemID,
                  routing: routing,
                },
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
              const deleteResult =
                await generalPageService.deleteGeneralPage(widgetIdAsNumber);

              if (deleteResult.success) {
                setShowDeleteModal(false);

                // remove all prior errors from the widget delete source if service call succeeded
                setErrors((prev) =>
                  prev.filter((error) => error.source !== "widget:delete"),
                );

                router.replace("/");
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
                showSnackbar("Failed to delete Collection", "bottom", "error");
                setShowDeleteModal(false);
              }
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
                setErrors((prev) => [
                  ...prev,
                  {
                    ...deleteResult.error,
                    hasBeenRead: false,
                    id: `${Date.now()}-${Math.random()}`,
                    source: "item:delete",
                  },
                ]);
                showSnackbar(
                  "Failed to delete collection item.",
                  "bottom",
                  "error",
                );
                setShowItemDeleteModal(false);

                setShowError(true);
              }
            } catch (error) {
              console.error("Error deleting item:", error);
            }
          }
        }}
        onclose={() => setShowItemDeleteModal(false)}
      />

      {!collection?.archived && (
        <View style={{ position: "absolute", right: 20, bottom: 30 }}>
          <FloatingAddButton
            onPress={() => {
              router.push({
                pathname: "/addCollectionItem",
                params: {
                  templateId: collection?.templateID?.toString(),
                  collectionId: collection?.collectionID?.toString(),
                  pageId: pageId,
                  routing: routing,
                },
              });
            }}
          />
        </View>
      )}
      <SelectFolderModal
        widgetTitle={title}
        widgetId={pageId}
        onClose={() => setShowFolderSelectionModal(false)}
        visible={showFolderSelectionModal}
        onMoved={(success: boolean) => {
          if (success) {
            showSnackbar(
              "Collection moved to folder successfully",
              "bottom",
              "success",
            );
            setShouldReload(true);
          } else {
            showSnackbar("Failed to move note to folder.", "bottom", "error");
          }
          setShowFolderSelectionModal(false);
        }}
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
