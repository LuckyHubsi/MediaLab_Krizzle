import React, { useCallback, useEffect, useRef, useState } from "react";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { CollectionLoadItem } from "@/components/ui/CollectionLoadItems/CollectionLoadItems";
import {
  AccessibilityInfo,
  findNodeHandle,
  Platform,
  ScrollView,
  View,
} from "react-native"; // Use ScrollView from react-native
import QuickActionModal from "@/components/Modals/QuickActionModal/QuickActionModal";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import { GradientBackgroundWrapper } from "@/components/ui/GradientBackground/GradientBackground.styles";
import { ItemDTO } from "@/shared/dto/ItemDTO";
import { useServices } from "@/context/ServiceContext";
import { EnrichedError } from "@/shared/error/ServiceError";
import { ErrorPopup } from "@/components/Modals/ErrorModal/ErrorModal";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";

/**
 * CollectionItemScreen is a screen that displays a collection item.
 */

export default function CollectionItemScreen() {
  const { itemId, collectionItemText, routing, archived } =
    useLocalSearchParams<{
      itemId: string;
      collectionItemText?: string;
      routing?: string;
      archived?: string;
    }>();

  const isArchived = archived === "true";
  const { collectionService } = useServices();

  const [item, setItem] = useState<ItemDTO>();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemName, setItemName] = useState<string>("");

  const [errors, setErrors] = useState<EnrichedError[]>([]);
  const [showError, setShowError] = useState(false);
  const headerRef = useRef<View | null>(null);

  const { showSnackbar } = useSnackbar();

  /**
   * useFocusEffect is used to fetch the item details when the screen is focused.
   */
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

      const timeout = setTimeout(() => {
        const node = findNodeHandle(headerRef.current);
        if (node) {
          AccessibilityInfo.setAccessibilityFocus(node);
        }
      }, 100);

      return () => clearTimeout(timeout);
    }, [itemId]),
  );

  /**
   * Components used:
   *
   * - GradientBackgroundWrapper: A wrapper component for the gradient background.
   * - CustomStyledHeader: A custom header component for the screen.
   * - ThemedView: A themed view component that adapts to the current theme.
   * - CollectionLoadItem: A component that displays the collection item details.
   * - QuickActionModal: A modal for quick actions on the collection item.
   * - DeleteModal: A modal for confirming deletion of the collection item.
   * - ErrorPopup: A popup for displaying errors.
   */
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        <GradientBackgroundWrapper
          colors={["#4599E8", "#583FE7"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 400,
            zIndex: -1,
          }}
        />
        <View style={{ marginTop: 16 }}>
          <CustomStyledHeader
            title={collectionItemText || "Collection Item"}
            subtitle={item?.categoryName || "Collection List"}
            backBehavior="goCollection"
            iconName={undefined}
            onIconPress={() => {}}
            iconName2={!isArchived ? "more-horiz" : undefined}
            onIconMenuPress={() => {
              if (!isArchived) setShowModal(true);
            }}
            param={item?.pageID.toString()}
            borderRadiusTop={33}
            routing={routing}
            headerRef={headerRef}
          />
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <ThemedView topPadding={0} style={{ paddingBottom: 20 }}>
            <CollectionLoadItem attributeValues={item?.attributeValues} />
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
        onClose={() => setShowDeleteModal(false)}
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
