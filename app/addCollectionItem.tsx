import { Header } from "@/components/ui/Header/Header";
import {
  AccessibilityInfo,
  findNodeHandle,
  Keyboard,
  Platform,
  ScrollView,
  View,
} from "react-native";
import BottomButtons from "@/components/ui/BottomButtons/BottomButtons";
import AddCollectionItemCard from "@/components/ui/AddCollectionItemCard/AddCollectionItemCard";
import { router, useFocusEffect } from "expo-router";
import { CollectionCategoryDTO } from "@/shared/dto/CollectionCategoryDTO";
import { AttributeDTO } from "@/shared/dto/AttributeDTO";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ItemAttributeValueDTO } from "@/shared/dto/ItemAttributeValueDTO";
import { ItemDTO } from "@/shared/dto/ItemDTO";
import { GradientBackground } from "@/components/ui/GradientBackground/GradientBackground";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";
import { AttributeType } from "@/shared/enum/AttributeType";
import { useServices } from "@/context/ServiceContext";
import { EnrichedError } from "@/shared/error/ServiceError";
import { ErrorPopup } from "@/components/Modals/ErrorModal/ErrorModal";

/**
 * AddCollectionItem Screen component that allows users to add items to a collection.
 */

export default function AddCollectionItem() {
  // Extracting parameters from the URL using useLocalSearchParams
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
  const headerRef = useRef<View | null>(null);

  /**
   * sets the screenreader focus to the header after mount
   */
  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(() => {
        const node = findNodeHandle(headerRef.current);
        if (node) {
          AccessibilityInfo.setAccessibilityFocus(node);
        }
      }, 100);

      return () => clearTimeout(timeout);
    }, []),
  );

  /**
   * Effect hook to fetch the item template and collection categories
   * On success, sets attributes or lists and clears related errors.
   * On failure, adds the corresponding error to the error list and shows the error message.
   */
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

  /**
   * Effect to handle keyboard visibility on Android.
   * This is necessary to adjust the layout when the keyboard is shown or hidden.
   */
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

  /**
   * Function to handle input changes for attributes (updates based on user input).
   * @param attributeID - The ID of the attribute being changed.
   * @param value - The new value for the attribute.
   * @param displayText - Optional display text for link attributes.
   * @param altText - Optional alt text for image attributes.
   */
  const handleInputChange = (
    attributeID: number,
    value: any,
    displayText?: string,
    altText?: string,
  ) => {
    setAttributeValues((prevValues) => {
      const attribute = attributes.find((a) => a.attributeID === attributeID);
      if (!attribute) return prevValues;

      const isLink = attribute.type === AttributeType.Link;
      const isImage = attribute.type === AttributeType.Image;

      let newValue;
      if (isLink) {
        newValue = {
          value: value?.trim() || null,
          displayText: displayText?.trim() || null,
        };
      } else if (isImage) {
        newValue = {
          uri: typeof value === "string" ? value : value?.uri || null,
          altText: altText?.trim() || null,
        };
      } else {
        newValue = value;
      }

      return {
        ...prevValues,
        [attributeID]: newValue,
      };
    });
  };

  /**
   * Function to handle changes in the selected list (category).
   */
  const handleListChange = (categoryID: number | null) => {
    setSelectedCategoryID(categoryID);
  };

  /**
   * Function to validate the fields of the collection item.
   */
  const validateFields = () => {
    const firstTextAttribute = attributes.find(
      (attribute) => attribute.type === AttributeType.Text,
    );
    if (!firstTextAttribute) return true;

    const value = attributeValues[firstTextAttribute.attributeID || 0];
    return value && value.trim() !== "";
  };

  /**
   * Function to map attributes to an ItemDTO.
   * This function transforms the attributes and their values into a format suitable for the ItemDTO.
   */
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
              altText: value?.altText?.trim?.() || null,
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

  /**
   * Function to handle saving the collection item.
   */
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

  /**
   * Components used:
   * - GradientBackground: A background component with a gradient effect.
   * - Header: A header component for the screen.
   * - AddCollectionItemCard: A card component for adding collection items.
   * - BottomButtons: A component for the bottom action buttons (Discard and Add).
   * - ErrorPopup: A modal component for displaying errors.
   */
  return (
    <GradientBackground
      backgroundCardTopOffset={Platform.select({ ios: 55, android: 60 })}
      topPadding={Platform.select({ ios: 20, android: 10 })}
    >
      <View style={{ flex: 1 }}>
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <Header
            title="Add Collection Item"
            onIconPress={() => alert("Popup!")}
            headerRef={headerRef}
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
