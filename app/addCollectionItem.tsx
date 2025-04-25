import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/ui/Header/Header";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { View } from "react-native";
import BottomButtons from "@/components/ui/BottomButtons/BottomButtons";
import AddCollectionItemCard from "@/components/ui/AddCollectionItemCard/AddCollectionItemCard";
import { router } from "expo-router";
import { CollectionCategoryDTO } from "@/dto/CollectionCategoryDTO";
import { ItemTemplateDTO } from "@/dto/ItemTemplateDTO";
import { AttributeDTO } from "@/dto/AttributeDTO";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getTemplate } from "@/services/ItemTemplateService";
import { getCollectionCategories } from "@/services/CollectionCategoriesService";

export default function AddCollectionItem() {
  const { templateId, collectionId } = useLocalSearchParams<{
    templateId?: string;
    collectionId?: string;
  }>();

  const [attributes, setAttributes] = useState<AttributeDTO[]>([]);
  const [lists, setLists] = useState<CollectionCategoryDTO[]>([]);

  useEffect(() => {
    (async () => {
      const numericTemplateID = Number(templateId);
      const numericCollectionID = Number(collectionId);
      if (!isNaN(numericTemplateID)) {
        const template = await getTemplate(numericTemplateID);

        if (template && template.attributes) {
          setAttributes(template.attributes);
        }
      }
      if (!isNaN(numericCollectionID)) {
        const lists = await getCollectionCategories(numericCollectionID);
        if (lists) {
          setLists(lists);
        }
      }
    })();
  }, [templateId]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Header
            title="Add Collection Item"
            onIconPress={() => alert("Popup!")}
          />

          <AddCollectionItemCard attributes={attributes} lists={lists} />

          {/* add correct function to discard/next */}
          <BottomButtons
            titleLeftButton={"Discard"}
            titleRightButton={"Add"}
            variant="discard"
            onDiscard={router.back}
            onNext={function (): void {}}
          ></BottomButtons>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
