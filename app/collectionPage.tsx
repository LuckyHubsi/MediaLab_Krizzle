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
import { template } from "@babel/core";
import {
  CollectionSelectable,
  CollectionTitle,
} from "@/components/ui/CollectionWidget/CollectionWidget.style";
import { useNavigation } from "@react-navigation/native";

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
  const navigation = useNavigation();

  // Hardcoded data for testing purposes
  const collectionData = {
    id: "1",
    collectionTitle: "Books",
    collectionTitleValue: "Harry Potter",
    collectionTextTitle: "Description",
    collectionTextValue:
      "Harry Potter is a series of fantasy novels written by J.K. Rowling, following the adventures of a young wizard and his friends at Hogwarts School of Witchcraft and Wizardry.",
    collectionList: "List 1",
    collectionDateValue: "2025-04-23",
    collectionRating: "4",
    collectionSelectable: [
      "Fantasy",
      "Adventure",
      "Magic",
      "Young Adult",
      "Mystery",
      "Drama",
      "Coming of Age",
    ],
    collectionDateTitle: "Finished reading",
    CollectionSelectableTitle: "Genres",
  };

  // interface ColectionWidget {
  //   id: string;
  //   collectionTitle?: string;
  //   collectionTitleValue?: string;
  //   collectionText?: string;
  //   collectionTextValue?: string;
  //   collectionList?: string;
  //   collectionDateTitle?: string;
  //   collectionDateValue?: string;
  //   collectionRating?: string;
  //   collectionSelectableTitle?: string;
  //   collectionSelectable?: string[];
  //   [key: string]: any;
  // }

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
            onSearch={(text) => console.log(text)}
          />
          {/* //Hardcoded data for testing purposes */}
          <CollectionList
            collectionLists={listNames}
            onPress={() => console.log("Pressed!")}
          />
          {/* //Hardcoded data for testing purposes */}
          <CollectionWidget
            collectionTitleValue={collectionData.collectionTitleValue}
            collectionTextValue={collectionData.collectionTextValue}
            collectionList={collectionData.collectionList}
            collectionDateValue={collectionData.collectionDateValue}
            collectionRating={collectionData.collectionRating}
            collectionSelectable={collectionData.collectionSelectable}
            onPress={() =>
              //navigate to a new screen when the widget is pressed
              router.push({
                pathname: "/collectionItemPage",
                //for now it is passing hard coded params
                params: { collectionData: JSON.stringify(collectionData) },
              })
            }
          />
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
