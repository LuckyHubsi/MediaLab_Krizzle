import React, { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import CollectionList from "../CollectionList/CollectionList";
import { BackgroundCard } from "./CollectionListCard.styles";
import { SafeAreaView, ScrollView, View, ViewProps } from "react-native";
import {
  GradientBackgroundWrapper,
  StyledView,
} from "../GradientBackground/GradientBackground.styles";
import { ThemedView } from "../ThemedView/ThemedView";
import { router } from "expo-router";
import CollectionWidget from "../CollectionWidget/CollectionWidget";
import { ThemedText } from "@/components/ThemedText";
import { ar } from "date-fns/locale";

export type CollectionListCardPorps = ViewProps & {
  collectionLists: string[];
  onSelect?: (selected: string | null) => void;
  listNames?: string[];
  setSelectedList?: (selectedList: string) => void;
  lightColor?: string;
  darkColor?: string;
  topPadding?: number;
  backgroundCardTopOffset?: number;
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

export const CollectionListCard: React.FC<CollectionListCardPorps> = ({
  collectionLists,
  onSelect,
  listNames = [],
  setSelectedList,
  lightColor,
  darkColor,
  topPadding = 30,
  style,
  children,
  backgroundCardTopOffset,
  filteredItems = [],
  items,
  setSelectedItem,
  setShowItemModal,
  searchQuery,
  routing,
  collectionId,
  isArchived = false,
  goToEdit,
  ...otherProps
}) => {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );

  const [selectedListInside, setSelectedListInside] = useState("");

  return (
    <View style={{ flex: 1 }}>
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

      <BackgroundCard
        backgroundColor={backgroundColor}
        topOffset={backgroundCardTopOffset}
        style={{ marginTop: 9 }}
      >
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
                  style={{ textAlign: "center" }}
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
