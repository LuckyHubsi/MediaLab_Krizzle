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
import { EnrichedError } from "@/shared/error/ServiceError";
import { ErrorPopup } from "@/components/Modals/ErrorModal/ErrorModal";

export default function AddCollectionItem() {
  const { templateId, collectionId, pageId, routing } = useLocalSearchParams<{
    templateId?: string;
    collectionId?: string;
    pageId?: string;
    routing?: string;
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

  const [errors, setErrors] = useState<EnrichedError[]>([]);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    (async () => {
      const numericTemplateID = Number(templateId);
      const numericCollectionID = Number(collectionId);
      if (!isNaN(numericTemplateID)) {
        const templateResult =
          await itemTemplateService.getTemplate(numericTemplateID);

        if (templateResult.success) {
          if (templateResult.value && templateResult.value.attributes) {
            setAttributes(templateResult.value.attributes);
          }

          // remove all prior errors from the template retrieval source if service call succeeded
          setErrors((prev) =>
            prev.filter((error) => error.source !== "template:retrieval"),
          );
        } else {
          // set all errors to the previous errors plus add the new error
          // define the id and the source and set its read status to false
          setErrors((prev) => [
            ...prev,
            {
              ...templateResult.error,
              hasBeenRead: false,
              id: `${Date.now()}-${Math.random()}`,
              source: "template:retrieval",
            },
          ]);
          setShowError(true);
        }
        if (!isNaN(numericCollectionID)) {
          const listResult =
            await collectionService.getCollectionCategories(
              numericCollectionID,
            );
          if (listResult.success) {
            setLists(listResult.value);

            // remove all prior errors from the list retrieval source if service call succeeded
            setErrors((prev) =>
              prev.filter((error) => error.source !== "list:retrieval"),
            );
          } else {
            // set all errors to the previous errors plus add the new error
            // define the id and the source and set its read status to false
            setErrors((prev) => [
              ...prev,
              {
                ...listResult.error,
                hasBeenRead: false,
                id: `${Date.now()}-${Math.random()}`,
                source: "list:retrieval",
              },
            ]);
            setShowError(true);
          }
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
    const firstTextAttribute = attributes.find(
      (attribute) => attribute.type === AttributeType.Text,
    );
    if (!firstTextAttribute) return true;

    const value = attributeValues[firstTextAttribute.attributeID || 0];
    return value && value.trim() !== "";
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
            return {
              ...attribute,
              valueString: typeof value === "string" ? value : value?.uri || "",
              displayText: value?.alt?.trim?.() || null,
            };
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
    const itemIdResult = await collectionService.insertItemAndReturnID(itemDTO);

    const firstKey = Object.keys(attributeValues)[0];
    const firstValueRaw = firstKey
      ? attributeValues[Number(firstKey)]
      : undefined;
    const collectionItemText =
      typeof firstValueRaw === "object" && firstValueRaw?.displayText
        ? firstValueRaw.displayText
        : (firstValueRaw ?? "");

    if (itemIdResult.success) {
      showSnackbar("Collection item successfully added.", "bottom", "success");

      // remove all prior errors from the item insert source if service call succeeded
      setErrors((prev) =>
        prev.filter((error) => error.source !== "item:insert"),
      );
      router.replace({
        pathname: "/collectionItemPage",
        params: {
          itemId: itemIdResult.value,
          collectionItemText,
          routing: routing,
        },
      });
    } else {
      // set all errors to the previous errors plus add the new error
      // define the id and the source and set its read status to false
      setErrors((prev) => [
        ...prev,
        {
          ...itemIdResult.error,
          hasBeenRead: false,
          id: `${Date.now()}-${Math.random()}`,
          source: "item:insert",
        },
      ]);
      setShowError(true);
    }
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

      <ErrorPopup
        visible={showError && errors.some((e) => !e.hasBeenRead)}
        errors={errors.filter((e) => !e.hasBeenRead) || []}
        onClose={(updatedErrors) => {
          // all current errors get tagged as hasBeenRead true on close of the modal (dimiss or click outside)
          const updatedIds = updatedErrors.map((e) => e.id);
          const newCombined = errors.map((e) =>
            updatedIds.includes(e.id) ? { ...e, hasBeenRead: true } : e,
          );
          setErrors(newCombined);
          setShowError(false);
        }}
      />
    </GradientBackground>
  );
}
