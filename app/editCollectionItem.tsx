import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/ui/Header/Header";
import { Platform, View } from "react-native";
import BottomButtons from "@/components/ui/BottomButtons/BottomButtons";
import AddCollectionItemCard from "@/components/ui/AddCollectionItemCard/AddCollectionItemCard";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { itemService } from "@/services/ItemService";
import { itemTemplateService } from "@/services/ItemTemplateService";
import { AttributeDTO } from "@/dto/AttributeDTO";
import { AttributeType } from "@/utils/enums/AttributeType";
import { CollectionCategoryDTO } from "@/dto/CollectionCategoryDTO";
import { collectionService } from "@/services/CollectionService";
import { GradientBackground } from "@/components/ui/GradientBackground/GradientBackground";
import { ItemDTO } from "@/dto/ItemDTO";
import { ItemAttributeValueDTO } from "@/dto/ItemAttributeValueDTO";

export default function EditCollectionItem() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();

  const [attributes, setAttributes] = useState<AttributeDTO[]>([]);
  const [attributeValues, setAttributeValues] = useState<Record<number, any>>(
    {},
  );
  const [lists, setLists] = useState<CollectionCategoryDTO[]>([]);
  const [item, setItem] = useState<ItemDTO>();
  const [selectedCategoryID, setSelectedCategoryID] = useState<number | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const numericItemId = Number(itemId);
        const item = await itemService.getItemById(numericItemId);
        if (!item) throw new Error("Item not found.");

        const collection = await collectionService.getCollectionByPageId(
          item.pageID,
        );
        if (!collection) throw new Error("Collection not found.");

        const template = await itemTemplateService.getTemplate(
          collection.templateID!,
        );

        setAttributes(template.attributes || []);
        setLists(collection.categories);
        setSelectedCategoryID(item.categoryID || null);
        setItem(item);
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
    const numericCategoryID = categoryID !== null ? Number(categoryID) : null;

    setSelectedCategoryID(numericCategoryID);
  };

  return (
    <GradientBackground
      backgroundCardTopOffset={Platform.select({ ios: 55, android: 45 })}
      topPadding={Platform.select({ ios: 20, android: 30 })}
    >
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
          onNext={async () => {
            try {
              const numericItemId = Number(itemId);
              const currentItem = await itemService.getItemById(numericItemId);

              if (!currentItem.attributeValues) {
                throw new Error("Current item has no attribute values");
              }

              const currentAttributeValuesMap = new Map();
              currentItem.attributeValues.forEach((value) => {
                if (value.attributeID) {
                  currentAttributeValuesMap.set(value.attributeID, value);
                }
              });

              // maps attribute values
              const updatedAttributeValues = attributes
                .map((attr) => {
                  const attrID = attr.attributeID;
                  if (attrID == null) return null;

                  const currentValue = currentAttributeValuesMap.get(
                    attrID,
                  ) || { ...attr, itemID: numericItemId };
                  const newValue = attributeValues[attrID];

                  const updatedValue = {
                    ...currentValue,
                    itemID: numericItemId,
                  };

                  switch (attr.type) {
                    case AttributeType.Text:
                      updatedValue.valueString = newValue || "";
                      break;
                    case AttributeType.Date:
                      updatedValue.valueString = newValue
                        ? newValue.toISOString()
                        : null;
                      break;
                    case AttributeType.Rating:
                      updatedValue.valueNumber =
                        newValue !== undefined ? Number(newValue) : null;
                      break;
                    case AttributeType.Multiselect:
                      updatedValue.valueMultiselect = Array.isArray(newValue)
                        ? newValue
                        : [];
                      break;
                  }

                  return updatedValue;
                })
                .filter(Boolean) as ItemAttributeValueDTO[];

              // directly creates item with explicit conversion
              const updatedItem: ItemDTO = {
                itemID: Number(itemId),
                pageID: Number(currentItem.pageID),
                categoryID: selectedCategoryID,
                attributeValues: updatedAttributeValues || [],
              };

              const success = await itemService.editItemByID(updatedItem);

              if (success) {
                router.replace({
                  pathname: "/collectionItemPage",
                  params: { itemId: itemId },
                });
              } else {
                console.log("Failed to save changes");
              }
            } catch (error) {
              console.error("Error saving item:", error);
            }
          }}
          progressStep={10}
        />
      </View>
    </GradientBackground>
  );
}
