import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/ui/Header/Header";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { View } from "react-native";
import CreateCollectionList from "@/components/ui/CreateCollectionSteps/CreateCollectionList/CreateCollectionList";
import EditCollectionLists from "@/components/ui/EditCollectionLists/EditCollectionLists";
import { ro } from "date-fns/locale";
import { router, useLocalSearchParams } from "expo-router";
import { CollectionData } from "@/components/ui/CreateCollectionSteps/CreateCollection/CreateCollection";
import { getCollectionCategories } from "@/services/CollectionCategoriesService";
import { CollectionCategoryDTO } from "@/dto/CollectionCategoryDTO";

export default function EditCollectionListsScreen() {
  const { collectionId } = useLocalSearchParams<{
    collectionId: string;
  }>();
  // const [data, setData] = useState<CollectionData>({
  //   title: "",
  //   selectedTag: null,
  //   selectedColor: "#4599E8",
  //   selectedIcon: undefined,
  //   lists: [],
  //   templates: [],
  // });

  const [lists, setLists] = useState<CollectionCategoryDTO[]>([]);

  useEffect(() => {
    (async () => {
      const numericId = Number(collectionId);
      const collectionLists = await getCollectionCategories(numericId);

      // const collectionListsWithId = collectionLists.map((list) => ({
      //   id: list.collectionCategoryID?.toString() || "",
      //   title: list.category_name || "",
      // }));

      // const collectionData: CollectionData = {
      //   title: "",
      //   selectedTag: null,
      //   selectedColor: "#FFB74D",
      //   selectedIcon: "book",
      //   lists: collectionListsWithId,
      //   templates: [],
      // };

      // setData(collectionData);
      setLists(collectionLists);
    })();
  }, [collectionId]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <ThemedView style={{ flex: 1 }}>
        <EditCollectionLists
          data={data}
          setData={() => {}}
          onBack={() => {
            router.back();
          }}
          onNext={() => {
            router.back();
          }}
        />
      </ThemedView> */}
    </SafeAreaView>
  );
}
