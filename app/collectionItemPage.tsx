import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CollectionLoadItem } from "@/components/ui/CollectionLoadItems/CollectionLoadItems";
import { ScrollView } from "react-native"; // Use ScrollView from react-native
import { getItemById } from "@/services/ItemService";
import { ItemDTO } from "@/dto/ItemDTO";

export default function CollectionItemScreen() {
  const { itemId } = useLocalSearchParams<{
    itemId: string;
  }>();

  const [item, setItem] = useState<ItemDTO>();

  useEffect(() => {
    (async () => {
      const numericItemId = Number(itemId);
      const item = await getItemById(numericItemId);
      setItem(item);
    })();
  }, [itemId]);

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomStyledHeader
          title={item?.page_title || "Collection Item"} //Here should be the title of the collection
          backBehavior="default" // Go back to home when back button is pressed
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
              attributeValues={item?.attributeValues}
              listName={item?.categoryName}
            />
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
