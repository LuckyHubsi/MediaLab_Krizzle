import React, { FC, useState } from "react";
import CollectionList from "../CollectionList/CollectionList";
import { BackgroundCard } from "./CollectionListCard.styles";
import { ScrollView, View, ViewProps } from "react-native";
import { ThemedView } from "../ThemedView/ThemedView";
import { router } from "expo-router";
import CollectionWidget from "../CollectionWidget/CollectionWidget";
import { ThemedText } from "@/components/ThemedText";
import { useActiveColorScheme } from "@/context/ThemeContext";

/**
 * Component for displaying a collection list card with a list of (collection) items.
 * It includes a collection list selector and a scrollable view of items.
 * @param collectionLists (required) - Array of collection list names to display.
 * @param onSelect - Callback function to handle selection of a collection list.
 * @param listNames - Optional array of collection list names to display.
 * @param setSelectedList - Optional function to set the selected collection list.
 * @param filteredItems - Optional array of filtered items to display in the collection.
 * @param items - Optional object containing item attributes.
 * @param setSelectedItem - Optional function to set the selected item.
 * @param setShowItemModal - Optional function to control the visibility of the item modal (on LongPress).
 * @param searchQuery - Optional search query to filter items.
 * @param routing - Optional routing parameter for navigation.
 * @param collectionId - Optional ID of the collection to filter items.
 * @param isArchived - Optional boolean to indicate if the collection is archived.
 * @param goToEdit (required) - Function to navigate to the edit page for the collection.
 */

export type CollectionListCardPorps = ViewProps & {
  collectionLists: string[];
  onSelect?: (selected: string | null) => void;
  listNames?: string[];
  setSelectedList?: (selectedList: string) => void;
  filteredItems?: any[];
  items?: any;
  setSelectedItem?: (selectedItem: any) => void;
  setShowItemModal?: (showItemModal: boolean) => void;
  searchQuery?: string;
  routing?: string;
  collectionId?: string;
  isArchived?: boolean;
  goToEdit: () => void;
};

export const CollectionListCard: FC<CollectionListCardPorps> = ({
  listNames = [],
  setSelectedList,
  filteredItems = [],
  items,
  setSelectedItem,
  setShowItemModal,
  searchQuery,
  routing,
  collectionId,
  isArchived = false,
  goToEdit,
}) => {
  const [selectedListInside, setSelectedListInside] = useState("");
  const colorScheme = useActiveColorScheme();

  return (
    <View style={{ flex: 1 }}>
      {/* Collection List Container: Horizontal ScollView */}
      <CollectionList
        collectionLists={listNames}
        onSelect={(collectionList) => {
          if (setSelectedList) {
            setSelectedList(collectionList || "All");
            setSelectedListInside(collectionList);
          }
        }}
        collectionId={collectionId}
        isArchived={isArchived}
        goToEdit={goToEdit}
      />

      {/* Collection Items Container: Vertical ScrollView */}
      <BackgroundCard colorScheme={colorScheme}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ borderRadius: 33, flexGrow: 0, flexShrink: 0, flex: 0 }}
          contentContainerStyle={{
            paddingTop: 0,
            paddingBottom: 32,
            flexGrow: 1,
          }}
          bounces={false}
          overScrollMode="never"
        >
          <ThemedView>
            {/* Display filtered items or a message if no items are found */}
            {filteredItems.length > 0 ? (
              <View style={{ flex: 1, gap: 12 }}>
                {[...filteredItems].reverse().map((item, index) => (
                  <CollectionWidget
                    key={item.itemID}
                    attributes={items?.attributes || []}
                    item={item}
                    onPress={() => {
                      router.push({
                        pathname: "/collectionItemPage",
                        params: {
                          itemId: item.itemID.toString(),
                          collectionItemText: item.values[0],
                          routing: routing,
                          archived: isArchived?.toString(),
                        },
                      });
                    }}
                    //Open Item Modal on LongPress
                    onLongPress={() => {
                      if (!isArchived) {
                        if (setSelectedItem) {
                          setSelectedItem(item);
                        }
                        if (setShowItemModal) {
                          setShowItemModal(true);
                        }
                      }
                    }}
                    index={index}
                    itemCountPerList={filteredItems.length}
                    list={selectedListInside}
                  />
                ))}
              </View>
            ) : (
              <View style={{ marginTop: 24 }}>
                <ThemedText
                  fontSize="regular"
                  fontWeight="regular"
                  textIsCentered
                >
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : "No items in this collection yet."}
                </ThemedText>
              </View>
            )}
          </ThemedView>
        </ScrollView>
      </BackgroundCard>
    </View>
  );
};
