import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/ui/Header/Header";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { View } from "react-native";
import BottomButtons from "@/components/ui/BottomButtons/BottomButtons";
import AddCollectionItemCard from "@/components/ui/AddCollectionItemCard/AddCollectionItemCard";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getItemById } from "@/services/ItemService";
import { getTemplate } from "@/services/ItemTemplateService";
import { AttributeDTO } from "@/dto/AttributeDTO";
import { AttributeType } from "@/utils/enums/AttributeType";
import { CollectionCategoryDTO } from "@/dto/CollectionCategoryDTO";
import { getCollectionByPageId } from "@/services/CollectionService";
import { GradientBackground } from "@/components/ui/GradientBackground/GradientBackground";

export default function EditCollectionItem() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();

  const [attributes, setAttributes] = useState<AttributeDTO[]>([]);
  const [attributeValues, setAttributeValues] = useState<Record<number, any>>(
    {},
  );
  const [lists, setLists] = useState<CollectionCategoryDTO[]>([]);
  const [selectedCategoryID, setSelectedCategoryID] = useState<number | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const numericItemId = Number(itemId);
        const item = await getItemById(numericItemId);
        if (!item) throw new Error("Item not found.");

        const collection = await getCollectionByPageId(item.pageID);
        if (!collection) throw new Error("Collection not found.");

        const template = await getTemplate(collection.templateID!);

        setAttributes(template.attributes || []);
        setLists(collection.categories);
        setSelectedCategoryID(item.categoryID || null);

        const mappedValues: Record<number, any> = {};

        item.attributeValues?.forEach((attrValue) => {
          const attrID = attrValue.attributeID;
          if (attrID == null) return;

          const templateAttr = template.attributes?.find(
            (a) => a.attributeID === attrID,
          );
          if (!templateAttr) return;

          switch (templateAttr.type) {
            case AttributeType.Date:
              mappedValues[attrID] =
                "valueString" in attrValue && attrValue.valueString
                  ? new Date(attrValue.valueString)
                  : null;
              break;

            case AttributeType.Rating:
              mappedValues[attrID] =
                "valueNumber" in attrValue
                  ? (attrValue.valueNumber ?? null)
                  : null;
              break;

            case AttributeType.Multiselect:
              mappedValues[attrID] =
                "valueMultiselect" in attrValue
                  ? (attrValue.valueMultiselect ?? [])
                  : [];
              break;

            case AttributeType.Text:
            default:
              mappedValues[attrID] =
                "valueString" in attrValue ? (attrValue.valueString ?? "") : "";
              break;
          }
        });

        setAttributeValues(mappedValues);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [itemId]);

  const handleInputChange = (attributeID: number, value: any) => {
    setAttributeValues((prev) => ({
      ...prev,
      [attributeID]: value,
    }));
  };

  const handleListChange = (categoryID: number | null) => {
    setSelectedCategoryID(categoryID);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GradientBackground backgroundCardTopOffset={30}>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View>
            <Header
              title="Edit Collection Item"
              onIconPress={() => alert("Popup!")}
            />

            <AddCollectionItemCard
              attributes={attributes}
              lists={lists}
              attributeValues={attributeValues}
              onInputChange={handleInputChange}
              onListChange={handleListChange}
              selectedCategoryID={selectedCategoryID}
            />
          </View>

          <BottomButtons
            titleLeftButton={"Cancel"}
            titleRightButton={"Continue"}
            variant="discard"
            onDiscard={router.back}
            onNext={() => {
              console.log("Edited values", {
                attributes,
                attributeValues,
                selectedCategoryID,
              });
            }}
            progressStep={10}
          />
        </View>
      </GradientBackground>
    </SafeAreaView>
  );
}
