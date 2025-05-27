import { Header } from "@/components/ui/Header/Header";
import { Keyboard, Platform, ScrollView, View } from "react-native";
import BottomButtons from "@/components/ui/BottomButtons/BottomButtons";
import AddCollectionItemCard from "@/components/ui/AddCollectionItemCard/AddCollectionItemCard";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { AttributeDTO } from "@/shared/dto/AttributeDTO";
import { GradientBackground } from "@/components/ui/GradientBackground/GradientBackground";
import { ItemDTO } from "@/shared/dto/ItemDTO";
import { ItemAttributeValueDTO } from "@/shared/dto/ItemAttributeValueDTO";
import { CollectionCategoryDTO } from "@/shared/dto/CollectionCategoryDTO";
import { AttributeType } from "@/shared/enum/AttributeType";
import { useServices } from "@/context/ServiceContext";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";

export default function EditCollectionItem() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();

  const { collectionService, itemTemplateService } = useServices();

  const [attributes, setAttributes] = useState<AttributeDTO[]>([]);
  const [attributeValues, setAttributeValues] = useState<Record<number, any>>(
    {},
  );
  const [lists, setLists] = useState<CollectionCategoryDTO[]>([]);
  const [item, setItem] = useState<ItemDTO>();
  const [selectedCategoryID, setSelectedCategoryID] = useState<number | null>(
    null,
  );
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasClickedSave, setHasClickedSave] = useState(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    (async () => {
      try {
        const numericItemId = Number(itemId);
        const itemResult = await collectionService.getItemByID(numericItemId);

        if (itemResult.success) {
          setItem(itemResult.value);
          const collectionResult =
            await collectionService.getCollectionByPageId(
              itemResult.value.pageID,
            );
          if (collectionResult.success) {
            setLists(collectionResult.value.categories);
            setSelectedCategoryID(itemResult.value.categoryID || null);
            const templateResult = await itemTemplateService.getTemplate(
              collectionResult.value.templateID!,
            );

            if (templateResult.success) {
              setAttributes(templateResult.value.attributes || []);

              const mappedValues: Record<number, any> = {};

              itemResult.value.attributeValues?.forEach((attrValue) => {
                const attrID = attrValue.attributeID;
                if (attrID == null) return;

                const templateAttr = templateResult.value.attributes?.find(
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

                  case AttributeType.Link:
                    mappedValues[attrID] = {
                      value:
                        "valueString" in attrValue
                          ? (attrValue.valueString ?? "")
                          : "",
                      displayText:
                        "displayText" in attrValue
                          ? (attrValue.displayText ?? "")
                          : "",
                    };
                    break;

                  case AttributeType.Image:
                    mappedValues[attrID] =
                      "valueString" in attrValue
                        ? (attrValue.valueString ?? "")
                        : "";
                    break;

                  case AttributeType.Text:
                  default:
                    mappedValues[attrID] =
                      "valueString" in attrValue
                        ? (attrValue.valueString ?? "")
                        : "";
                    break;
                }
              });

              setAttributeValues(mappedValues);
            } else {
              // TODO: show error modal
              console.log(templateResult.error.type);
              console.log(templateResult.error.message);
            }
          }
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [itemId]);

  useEffect(() => {
    if (Platform.OS === "android") {
      const showSub = Keyboard.addListener("keyboardDidShow", () =>
        setKeyboardVisible(true),
      );
      const hideSub = Keyboard.addListener("keyboardDidHide", () =>
        setKeyboardVisible(false),
      );
      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }
  }, []);

  const handleInputChange = (
    attributeID: number,
    value: any,
    displayText?: string,
  ) => {
    setAttributeValues((prevValues) => {
      const isLink =
        attributes.find((a) => a.attributeID === attributeID)?.type ===
        AttributeType.Link;

      return {
        ...prevValues,
        [attributeID]: isLink
          ? {
              value: value?.trim() || null,
              displayText: displayText?.trim() || null,
            }
          : value,
      };
    });
  };

  const handleListChange = (categoryID: number | null) => {
    const numericCategoryID = categoryID !== null ? Number(categoryID) : null;

    setSelectedCategoryID(numericCategoryID);
  };

  const validateTitle = () => {
    const titleAttr = attributes.find((a) => a.type === AttributeType.Text);
    if (!titleAttr) return true;
    const val = attributeValues[titleAttr.attributeID!];
    return typeof val === "string" && val.trim().length > 0;
  };

  return (
    <GradientBackground
      backgroundCardTopOffset={Platform.select({ ios: 55, android: 45 })}
      topPadding={Platform.select({ ios: 20, android: 30 })}
    >
      <View style={{ flex: 1 }}>
        <View style={{ marginBottom: 10 }}>
          <Header
            title="Edit Collection Item"
            onIconPress={() => alert("Popup!")}
          />
        </View>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 95 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AddCollectionItemCard
            attributes={attributes}
            lists={lists}
            attributeValues={attributeValues}
            onInputChange={handleInputChange}
            onListChange={handleListChange}
            selectedCategoryID={selectedCategoryID}
            hasNoInputError={hasClickedSave && !validateTitle()}
          />
        </ScrollView>
        {(Platform.OS !== "android" || !keyboardVisible) && (
          <BottomButtons
            titleLeftButton={"Cancel"}
            titleRightButton={"Save"}
            variant="discard"
            onDiscard={router.back}
            onNext={async () => {
              setHasClickedSave(true);
              if (!validateTitle()) {
                showSnackbar("Please enter a title.", "bottom", "error");
                return;
              }
              try {
                const numericItemId = Number(itemId);
                const currentItemResult =
                  await collectionService.getItemByID(numericItemId);

                if (currentItemResult.success) {
                  const currentAttributeValuesMap = new Map();
                  currentItemResult.value.attributeValues.forEach((value) => {
                    if (value.attributeID) {
                      currentAttributeValuesMap.set(value.attributeID, value);
                    }
                  });
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
                          updatedValue.valueMultiselect = Array.isArray(
                            newValue,
                          )
                            ? newValue
                            : [];
                          break;
                        case AttributeType.Link:
                          updatedValue.valueString =
                            newValue?.value?.trim() || null;
                          updatedValue.displayText =
                            newValue?.displayText?.trim() || null;
                          break;
                        case AttributeType.Image:
                          updatedValue.valueString = newValue || null;
                          break;
                      }

                      return updatedValue;
                    })
                    .filter(Boolean) as ItemAttributeValueDTO[];

                  const updatedItem: ItemDTO = {
                    itemID: Number(itemId),
                    pageID: Number(currentItemResult.value.pageID),
                    categoryID: selectedCategoryID,
                    attributeValues: updatedAttributeValues || [],
                  };

                  const updateResult =
                    await collectionService.editItemByID(updatedItem);

                  if (updateResult.success) {
                    router.replace({
                      pathname: "/collectionItemPage",
                      params: { itemId: itemId },
                    });
                  }
                } else {
                  // TODO: show error modal
                }
              } catch (error) {
                console.error("Error saving item:", error);
              }
            }}
            progressStep={10}
          />
        )}
      </View>
    </GradientBackground>
  );
}
