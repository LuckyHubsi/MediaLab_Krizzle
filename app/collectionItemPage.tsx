import React, { useCallback, useEffect, useState } from "react";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { CollectionLoadItem } from "@/components/ui/CollectionLoadItems/CollectionLoadItems";
import { ScrollView } from "react-native"; // Use ScrollView from react-native
import { itemService } from "@/services/ItemService";
import { ItemDTO } from "@/dto/ItemDTO";
import QuickActionModal from "@/components/Modals/QuickActionModal/QuickActionModal";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";

export default function CollectionItemScreen() {
  const { itemId } = useLocalSearchParams<{
    itemId: string;
  }>();

  const [item, setItem] = useState<ItemDTO>();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemName, setItemName] = useState<string>("");

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const numericItemId = Number(itemId);
        const item = await itemService.getItemById(numericItemId);

        setItem(item);

        if (
          item &&
          item.attributeValues &&
          "valueString" in item.attributeValues[0]
        ) {
          setItemName(item?.attributeValues[0]?.valueString || "");
        }
      })();
    }, [itemId]),
  );

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomStyledHeader
          title={item?.page_title || "Collection Item"} //Here should be the title of the collection
          backBehavior="default" // Go back to home when back button is pressed
          iconName={undefined} // No icon for the header
          onIconPress={() => {}} // No action when pressed
          iconName2="more-horiz" // icon for the pop up menu
          onIconMenuPress={() => {
            setShowModal(true);
          }} // action when icon menu is pressed
          param={item?.pageID.toString()}
        />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false} // Hides the vertical scrollbar
        >
          <ThemedView topPadding={0}>
            <CollectionLoadItem
              attributeValues={item?.attributeValues}
              listName={item?.categoryName}
            />
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
      <QuickActionModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        items={[
          {
            label: "Edit Item",
            icon: "edit",
            onPress: () => {
              router.push({
                pathname: "/editCollectionItem",
                params: { itemId },
              });
            },
          },
          {
            label: "Delete Item",
            icon: "delete",
            onPress: () => {
              setShowDeleteModal(true);
            },
            danger: true,
          },
        ]}
      />
      <DeleteModal
        visible={showDeleteModal}
        title={itemName}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (item) {
            try {
              const itemIdAsNumber = Number(item.itemID);
              const successfullyDeleted =
                await itemService.deleteItemById(itemIdAsNumber);

              setShowDeleteModal(false);
              router.replace({
                pathname: "/collectionPage",
                params: { pageId: item.pageID },
              });
            } catch (error) {
              console.error("Error deleting item:", error);
            }
          }
        }}
        onclose={() => setShowDeleteModal(false)}
      />
    </>
  );
}
