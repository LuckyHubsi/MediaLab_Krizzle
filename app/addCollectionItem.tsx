import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/ui/Header/Header";
import { Platform, View } from "react-native";
import BottomButtons from "@/components/ui/BottomButtons/BottomButtons";
import AddCollectionItemCard from "@/components/ui/AddCollectionItemCard/AddCollectionItemCard";
import { router } from "expo-router";
import { CollectionCategoryDTO } from "@/dto/CollectionCategoryDTO";
import { AttributeDTO } from "@/dto/AttributeDTO";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { itemTemplateService } from "@/services/ItemTemplateService";
import { collectionCategoryService } from "@/services/CollectionCategoriesService";
import { ItemAttributeValueDTO } from "@/dto/ItemAttributeValueDTO";
import { ItemDTO } from "@/dto/ItemDTO";
import { AttributeType } from "@/utils/enums/AttributeType";
import { Button } from "@/components/ui/Button/Button";
import { itemService } from "@/services/ItemService";
import { GradientBackground } from "@/components/ui/GradientBackground/GradientBackground";

export default function AddCollectionItem() {
  const { templateId, collectionId, pageId } = useLocalSearchParams<{
    templateId?: string;
    collectionId?: string;
    pageId?: string;
  }>();

  const [attributes, setAttributes] = useState<AttributeDTO[]>([]);
  const [lists, setLists] = useState<CollectionCategoryDTO[]>([]);
  const [attributeValues, setAttributeValues] = useState<Record<number, any>>(
    {},
  );
  const [selectedCategoryID, setSelectedCategoryID] = useState<number | null>(
    null,
  );
  const [hasClickedNext, setHasClickedNext] = useState(false);

  useEffect(() => {
    (async () => {
      const numericTemplateID = Number(templateId);
      const numericCollectionID = Number(collectionId);
      if (!isNaN(numericTemplateID)) {
        const template =
          await itemTemplateService.getTemplate(numericTemplateID);

        if (template && template.attributes) {
          setAttributes(template.attributes);
        }
      }
      if (!isNaN(numericCollectionID)) {
        const lists =
          await collectionCategoryService.getCollectionCategories(
            numericCollectionID,
          );
        if (lists) {
          setLists(lists);
        }
      }
    })();
  }, [templateId]);

  const handleInputChange = (attributeID: number, value: any) => {
    setAttributeValues((prevValues) => ({
      ...prevValues,
      [attributeID]: value,
    }));
  };

  const handleListChange = (categoryID: number | null) => {
    setSelectedCategoryID(categoryID);
  };

  const validateFields = () => {
    return attributes.every((attribute) => {
      if (attribute.type === AttributeType.Text) {
        const value = attributeValues[attribute.attributeID || 0];
        return value && value.trim() !== "";
      }
      return true;
    });
  };

  const mapToItemDTO = (attributes: AttributeDTO[]): ItemDTO => {
    const attributeValueDTOs: ItemAttributeValueDTO[] = attributes.map(
      (attribute) => {
        const value = attributeValues[attribute.attributeID || 0];
        switch (attribute.type) {
          case AttributeType.Text:
            return { ...attribute, valueString: value };
          case AttributeType.Date:
            return { ...attribute, valueString: value?.toISOString() };
          case AttributeType.Rating:
            return { ...attribute, valueNumber: value };
          case AttributeType.Multiselect:
            return { ...attribute, valueMultiselect: value };
          default:
            return { ...attribute };
        }
      },
    );

    return {
      pageID: Number(pageId),
      categoryID: selectedCategoryID ? Number(selectedCategoryID) : null,
      attributeValues: attributeValueDTOs,
    };
  };

  const handleSaveItem = async () => {
    setHasClickedNext(true);
    const allFieldsValid = validateFields();
    if (!allFieldsValid) {
      alert("Please fill in all required fields.");
      return;
    }
    const itemDTO = mapToItemDTO(attributes);
    const itemId = await itemService.insertItemAndReturnID(itemDTO);
    router.replace({
      pathname: "/collectionItemPage",
      params: { itemId: itemId },
    });
  };

  return (
    <GradientBackground
      backgroundCardTopOffset={Platform.select({ ios: 55, android: 45 })}
      topPadding={Platform.select({ ios: 20, android: 30 })}
    >
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View>
          <Header
            title="Add Collection Item"
            onIconPress={() => alert("Popup!")}
          />

          <AddCollectionItemCard
            attributes={attributes}
            lists={lists}
            attributeValues={attributeValues}
            onInputChange={handleInputChange}
            onListChange={handleListChange}
            selectedCategoryID={selectedCategoryID}
            hasNoInputError={hasClickedNext && !validateFields()}
          />
        </View>

        <BottomButtons
          titleLeftButton="Discard"
          titleRightButton="Add"
          variant="discard"
          onDiscard={router.back}
          onNext={handleSaveItem}
          progressStep={10}
        />
      </View>
    </GradientBackground>
  );
}
