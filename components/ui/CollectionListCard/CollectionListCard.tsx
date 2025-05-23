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
  ...otherProps
}) => {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );
  return (
    <View style={{ flex: 1 }}>
      <CollectionList
        collectionLists={listNames}
        onSelect={(collectionList) => {
          if (setSelectedList) {
            setSelectedList(collectionList || "All");
          }
        }}
      />

      <BackgroundCard
        backgroundColor={backgroundColor}
        topOffset={backgroundCardTopOffset}
        style={{ marginTop: 9 }}
      >
        <ThemedView topPadding={24} style={{ borderRadius: 33 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredItems.length > 0 ? (
              <View style={{ flex: 1, gap: 12 }}>
                {filteredItems.map((item) => (
                  <CollectionWidget
                    key={item.itemID}
                    attributes={items?.attributes || []}
                    item={item}
                    onPress={() => {
                      router.push({
                        pathname: "/collectionItemPage",
                        params: { itemId: item.itemID.toString() },
                      });
                    }}
                    onLongPress={() => {
                      if (setSelectedItem) {
                        setSelectedItem(item);
                      }
                      if (setShowItemModal) {
                        setShowItemModal(true);
                      }
                    }}
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
          </ScrollView>
        </ThemedView>
      </BackgroundCard>
    </View>
  );
};
