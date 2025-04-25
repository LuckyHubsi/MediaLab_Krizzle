import React from "react";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { useLocalSearchParams, router } from "expo-router";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import { FloatingAddButton } from "@/components/ui/NavBar/FloatingAddButton/FloatingAddButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CollectionWidget from "@/components/ui/CollectionWidget/CollectionWidget";
import CollectionList from "@/components/ui/CollectionList/CollectionList";
import { useRouter } from "expo-router";
import {
  CollectionSelectable,
  CollectionTitle,
} from "@/components/ui/CollectionWidget/CollectionWidget.style";

export default function CollectionScreen() {
  const { title, selectedIcon } = useLocalSearchParams<{
    title?: string;
    selectedIcon?: keyof typeof MaterialIcons.glyphMap;
  }>();

  const navigation = useNavigation();
  const router = useRouter();

  // Hardcoded data for testing purposes
  const collectionData = {
    id: "1",
    collectionTitle: "Books",
    collectionTitleValue: "Harry Potter",
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
          //Hardcoded data for testing purposes
          <CollectionList
            collectionLists={["List 1", "List 2", "List 3", "List 4"]}
            onPress={() => console.log("Pressed!")}
          />
          //Hardcoded data for testing purposes
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
              onPress={() => router.push("/addCollectionItem")} // navigate to add collection item screen
            />
          </View>
        </ThemedView>
      </SafeAreaView>
    </>
  );
}
