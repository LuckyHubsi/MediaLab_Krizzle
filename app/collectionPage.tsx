import React from "react";
import TextEditor from "@/components/TextEditor/TextEditor";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { useLocalSearchParams, useNavigation } from "expo-router";
import SearchBar from "@/components/ui/SearchBar/SearchBar";
import { FloatingAddButton } from "@/components/ui/NavBar/FloatingAddButton/FloatingAddButton";
import { ModalSelection } from "@/components/ui/ModalSelection/ModalSelection";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CollectionWidget from "@/components/ui/CollectionWidget/CollectionWidget";
import CollectionList from "@/components/ui/CollectionList/CollectionList";

export default function CollectionScreen() {
  const { title, selectedIcon } = useLocalSearchParams<{
    title?: string;
    selectedIcon?: keyof typeof MaterialIcons.glyphMap;
  }>();

  const navigation = useNavigation();

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
            collectionLists={["List 1", "List 2", "List 3", "List 4"]}
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
              onPress={() => navigation.navigate("addCollectionItem")} // navigate to add collection item screen
            />
          </View>
        </ThemedView>
      </SafeAreaView>
    </>
  );
}
