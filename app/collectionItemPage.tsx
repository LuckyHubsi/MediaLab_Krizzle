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
import { Platform, ScrollView, View } from "react-native"; // Use ScrollView from react-native

import QuickActionModal from "@/components/Modals/QuickActionModal/QuickActionModal";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import { GradientBackgroundWrapper } from "@/components/ui/GradientBackground/GradientBackground.styles";
import Card from "@/components/ui/Card/Card";
import CollectionItemContainer from "@/components/ui/CollectionItemContainer/CollectionItemContainer";
import { ItemDTO } from "@/shared/dto/ItemDTO";
import { useServices } from "@/context/ServiceContext";
import { AttributeType } from "@/shared/enum/AttributeType";
import { EnrichedError } from "@/shared/error/ServiceError";
import { ErrorPopup } from "@/components/Modals/ErrorModal/ErrorModal";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";

export default function CollectionItemScreen() {
  const { itemId, collectionItemText, routing } = useLocalSearchParams<{
    itemId: string;
    collectionItemText?: string;
    routing?: string;
  }>();
  const { collectionService } = useServices();

  const [item, setItem] = useState<ItemDTO>();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemName, setItemName] = useState<string>("");

  const [errors, setErrors] = useState<EnrichedError[]>([]);
  const [showError, setShowError] = useState(false);

  const { showSnackbar } = useSnackbar();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const numericItemId = Number(itemId);
        const itemResult = await collectionService.getItemByID(numericItemId);

        if (itemResult.success) {
          setItem(itemResult.value);

          // remove all prior errors from the item retrieval source if service call succeeded
          setErrors((prev) =>
            prev.filter((error) => error.source !== "item:retrieval"),
          );
        } else {
          // set all errors to the previous errors plus add the new error
          // define the id and the source and set its read status to false
          setErrors((prev) => [
            ...prev,
            {
              ...itemResult.error,
              hasBeenRead: false,
              id: `${Date.now()}-${Math.random()}`,
              source: "item:retrieval",
            },
          ]);
          setShowError(true);
        }

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
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        {/* Background layers */}
        <GradientBackgroundWrapper
          colors={["#4599E8", "#583FE7"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 400,
            zIndex: -1, // Set zIndex lower than other elements
          }}
        />
        <View style={{ marginTop: 16 }}>
          <CustomStyledHeader
            title={collectionItemText || "Collection Item"} //Here should be the title of the collection
            subtitle={item?.categoryName || "Collection List"}
            backBehavior="goCollection" // Go back to home when back button is pressed
            iconName={undefined} // No icon for the header
            onIconPress={() => {}} // No action when pressed
            iconName2={routing ? undefined : "more-horiz"} // icon for the pop up menu
            onIconMenuPress={() => {
              setShowModal(true);
            }} // action when icon menu is pressed
            param={item?.pageID.toString()}
            borderRadiusTop={33}
            routing={routing}
          />
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false} // Hides the vertical scrollbar
        >
          <ThemedView topPadding={0} style={{ paddingBottom: 20 }}>
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
                params: { itemId, routing: routing },
              });
            },
          },
          {
            label: "Delete Item",
            icon: "delete",
            onPress: () => {
              setShowModal(false);
              if (Platform.OS === "ios") {
                setTimeout(() => {
                  setShowDeleteModal(true);
                }, 300);
              } else {
                setShowDeleteModal(true);
              }
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
              const deleteResult =
                await collectionService.deleteItemById(itemIdAsNumber);

              if (deleteResult.success) {
                setShowDeleteModal(true);

                // remove all prior errors from the item delete source if service call succeeded
                setErrors((prev) =>
                  prev.filter((error) => error.source !== "item:delete"),
                );
                router.replace({
                  pathname: "/collectionPage",
                  params: { pageId: item.pageID, routing: routing },
                });
              } else {
                setShowDeleteModal(false);

                // set all errors to the previous errors plus add the new error
                // define the id and the source and set its read status to false
                setErrors((prev) => [
                  ...prev,
                  {
                    ...deleteResult.error,
                    hasBeenRead: false,
                    id: `${Date.now()}-${Math.random()}`,
                    source: "item:delete",
                  },
                ]);
                setShowError(true);
                showSnackbar(
                  `Failed to delete the collection item.`,
                  "bottom",
                  "error",
                );
              }
            } catch (error) {
              console.error("Error deleting item:", error);
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
