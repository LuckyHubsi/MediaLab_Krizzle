import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/ui/Header/Header";
import { Keyboard, Platform, ScrollView, View } from "react-native";
import BottomButtons from "@/components/ui/BottomButtons/BottomButtons";
import AddCollectionItemCard from "@/components/ui/AddCollectionItemCard/AddCollectionItemCard";
import { router } from "expo-router";
import { CollectionCategoryDTO } from "@/shared/dto/CollectionCategoryDTO";
import { AttributeDTO } from "@/shared/dto/AttributeDTO";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ItemAttributeValueDTO } from "@/shared/dto/ItemAttributeValueDTO";
import { ItemDTO } from "@/shared/dto/ItemDTO";
import { Button } from "@/components/ui/Button/Button";
import { GradientBackground } from "@/components/ui/GradientBackground/GradientBackground";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";
import { AttributeType } from "@/shared/enum/AttributeType";
import { useServices } from "@/context/ServiceContext";

export default function AddCollectionItem() {
  const { templateId, collectionId, pageId } = useLocalSearchParams<{
    templateId?: string;
    collectionId?: string;
    pageId?: string;
  }>();
  const { collectionService, itemTemplateService } = useServices();

  const [keyboardVisible, setKeyboardVisible] = useState(false);
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
        const result = await itemTemplateService.getTemplate(numericTemplateID);

        if (result.success) {
          if (result.value && result.value.attributes) {
            setAttributes(result.value.attributes);
          }
        } else {
          // TODO: show error modal

          console.log(result.error.type);
          console.log(result.error.message);
        }
      }
      if (!isNaN(numericCollectionID)) {
        const listResult =
          await collectionService.getCollectionCategories(numericCollectionID);
        if (listResult.success) {
          setLists(listResult.value);
        } else {
          // TODO: show error modal
        }
      }
    })();
  }, [templateId]);

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
          case AttributeType.Link:
            return {
              ...attribute,
              valueString: value?.value?.trim() || null,
              displayText: value?.displayText?.trim() || null,
            };
          case AttributeType.Image:
            return { ...attribute, valueString: value };
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
    const titleIsValid = validateFields();
    if (!titleIsValid) {
      showSnackbar("Please fill in all required fields.", "bottom", "error");
      return;
    }
    const itemDTO = mapToItemDTO(attributes);
    const itemId = await collectionService.insertItemAndReturnID(itemDTO);
    router.replace({
      pathname: "/collectionItemPage",
      params: { itemId: itemId },
    });
  };

  const { showSnackbar } = useSnackbar();

  return (
    <GradientBackground
      backgroundCardTopOffset={Platform.select({ ios: 55, android: 45 })}
      topPadding={Platform.select({ ios: 20, android: 30 })}
    >
      <View style={{ flex: 1 }}>
        <View style={{ marginBottom: 10 }}>
          <Header
            title="Add Collection Item"
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
            hasNoInputError={hasClickedNext && !validateFields()}
          />
        </ScrollView>

        {(Platform.OS !== "android" || !keyboardVisible) && (
          <View>
            <BottomButtons
              titleLeftButton="Discard"
              titleRightButton="Add"
              variant="discard"
              onDiscard={router.back}
              onNext={handleSaveItem}
              progressStep={10}
            />
          </View>
        )}
      </View>
    </GradientBackground>
  );
}
