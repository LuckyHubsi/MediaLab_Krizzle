import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import { FloatingAddButton } from "@/components/ui/NavBar/FloatingAddButton/FloatingAddButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CollectionWidget from "@/components/ui/CollectionWidget/CollectionWidget";
import CollectionList from "@/components/ui/CollectionList/CollectionList";
import { getCollectionByPageId } from "@/services/CollectionService";
import { CollectionDTO } from "@/dto/CollectionDTO";

export default function CollectionScreen() {
  const router = useRouter();
  const { pageId, title, selectedIcon } = useLocalSearchParams<{
    pageId: string;
    title?: string;
    selectedIcon?: keyof typeof MaterialIcons.glyphMap;
  }>();

  const [collection, setCollection] = useState<CollectionDTO>();
  const [listNames, setListNames] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      console.log("page id: ", pageId);
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
        <ThemedView>
          <SearchBar
            placeholder="Search" // Placeholder text for the search bar
            onSearch={(text) => console.log(text)}
          />
          <CollectionList
            collectionLists={listNames}
            onPress={() => console.log("Pressed!")}
          />
          <CollectionWidget
            collectionTitle="Long Collection Title"
            collectionText="Text long Note etc. 
            still writing and still testing this long test test test"
            collectionList="List 1"
            collectionDate="2025-04-23"
            collectionRating="4"
            collectionSelectable={[
              "Games",
              "Movies",
              "Books",
              "Music",
              "Shows",
              "Apps",
              "Websites",
            ]}
            onPress={() => console.log("Pressed!")}
          />
          <View
            style={{
              position: "absolute",
              right: 10,
              bottom: 50,
            }}
          >
            <FloatingAddButton
              onPress={() => router.push("/addCollectionItem")} // navigate to add collection item screen
            />
          </View>
        </ThemedView>
      </SafeAreaView>
    </>
  );
}
