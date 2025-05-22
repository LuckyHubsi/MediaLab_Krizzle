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

export default function CollectionItemScreen() {
  const { itemId } = useLocalSearchParams<{
    itemId: string;
  }>();
  const { collectionService } = useServices();

  const [item, setItem] = useState<ItemDTO>();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemName, setItemName] = useState<string>("");
  const multiselectArrray = [
    "Action",
    "sci-fi",
    "fantasy",
    "romance",
    "horror",
    "thriller",
    "mystery",
  ];

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const numericItemId = Number(itemId);
        const item = await collectionService.getItemByID(numericItemId);

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

        <CustomStyledHeader
          title={item?.page_title || "Collection Item"} //Here should be the title of the collection
          subtitle={item?.categoryName || "Collection List"}
          backBehavior="default" // Go back to home when back button is pressed
          iconName={undefined} // No icon for the header
          onIconPress={() => {}} // No action when pressed
          iconName2="more-horiz" // icon for the pop up menu
          onIconMenuPress={() => {
            setShowModal(true);
          }} // action when icon menu is pressed
          param={item?.pageID.toString()}
          borderRadiusTop={33}
        />

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false} // Hides the vertical scrollbar
        >
          <ThemedView topPadding={0}>
            {/* <CollectionLoadItem
              attributeValues={item?.attributeValues}
              listName={item?.categoryName}
            /> */}
            <CollectionItemContainer imageUri="aaa" subtitle="Image" />
            <CollectionItemContainer
              title={item?.page_title}
              subtitle="harry potter"
            />
            <CollectionItemContainer
              subtitle="Genre"
              multiselectArray={multiselectArrray}
            />
            <View
              style={{
                flexDirection: "row",
                rowGap: 16,
                columnGap: 32,
                flexWrap: "wrap",
              }}
            >
              <CollectionItemContainer
                type="12.12.2025"
                subtitle="Recently Read"
                icon="calendar-month"
              />
              <CollectionItemContainer
                type="4/5"
                subtitle="Rating"
                icon="star"
              />
            </View>
            <CollectionItemContainer
              type="Textsfdojisfdjoifsojifdoijfdsoijs"
              subtitle="Description"
            />{" "}
            <CollectionItemContainer
              link="https://www.google.com"
              linkPreview="Google"
              subtitle="link"
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
              const successfullyDeleted =
                await collectionService.deleteItemById(itemIdAsNumber);

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
