import React, { useEffect, useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { ItemsDTO } from "@/dto/ItemsDTO";
import { getItemsByPageId } from "@/services/ItemService";

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

  useEffect(() => {
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
        const items: ItemsDTO = await getItemsByPageId(numericID);
        console.log(JSON.stringify(items, null, 2));
        if (items) setItems(items);
      }
    })();
  }, [pageId]);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomStyledHeader
          title={title || "Collection"} //Here should be the title of the collection
          backBehavior="goHome" // Go back to home when back button is pressed
          iconName={selectedIcon || undefined}
          onIconPress={() => {}} // No action when pressed
          iconName2="more-horiz" // icon for the pop up menu
          onIconMenuPress={() => alert("Popup!")} // action when icon menu is pressed
        />
        <ThemedView topPadding={0}>
          <SearchBar
            placeholder="Search" // Placeholder text for the search bar
            onSearch={(text) => {}}
          />
          {/* //Hardcoded data for testing purposes */}
          <CollectionList
            collectionLists={listNames}
            onPress={() => console.log("Pressed!")}
          />
          {/* //Hardcoded data for testing purposes */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ flex: 1, gap: 12 }}>
              {items?.items.map((item) => (
                <CollectionWidget
                  key={item.itemID}
                  attributes={items.attributes}
                  item={item}
                  onPress={() => {
                    router.push({
                      pathname: "/collectionItemPage",
                    });
                  }}
                />
              ))}
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
    </>
  );
}
