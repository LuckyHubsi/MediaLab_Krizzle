import React from "react";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CollectionLoadItem } from "@/components/ui/CollectionLoadItems/CollectionLoadItems";
import { ScrollView } from "react-native"; // Use ScrollView from react-native

export default function CollectionItemScreen() {
  const { collectionData } = useLocalSearchParams<{
    collectionData: string;
  }>();

  const parsedCollectionData = collectionData
    ? JSON.parse(collectionData)
    : null;

  //const navigation = useNavigation();

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomStyledHeader
          title={
            parsedCollectionData?.collectionTitleValue || "Collection Item"
          } //Here should be the title of the collection
          backBehavior="goHome" // Go back to home when back button is pressed
          iconName={undefined} // No icon for the header
          onIconPress={() => {}} // No action when pressed
          iconName2="more-horiz" // icon for the pop up menu
          onIconMenuPress={() => alert("Popup!")} // action when icon menu is pressed
        />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false} // Hides the vertical scrollbar
        >
          <ThemedView topPadding={0}>
            <CollectionLoadItem
              collectionTitle={
                parsedCollectionData?.collectionTitle || "Default Title"
              }
              collectionTitleValue={
                parsedCollectionData?.collectionTitleValue || "Default Title"
              }
              collectionTextTitle={
                parsedCollectionData?.collectionTextTitle || "Default Text"
              }
              collectionTextValue={
                parsedCollectionData?.collectionTextValue || "Default Text"
              }
              collectionList={parsedCollectionData?.collectionList || []}
              collectionDateTitle={
                parsedCollectionData?.collectionDateTitle || "Date"
              }
              collectionDateValue={
                parsedCollectionData?.collectionDateValue || "N/A"
              }
              collectionRating={parsedCollectionData?.collectionRating || 0}
              collectionSelectable={
                parsedCollectionData?.collectionSelectable || false
              }
              collectionSelectableTitle={
                parsedCollectionData?.CollectionSelectableTitle || "Selectable"
              }
            />
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
