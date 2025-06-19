import { FC, useEffect, useState, useRef } from "react";
import Textfield from "../Textfield/Textfield";
import DateField from "../DateField/DateField";
import { StyledCardWrapper } from "./AddCollectionItemCard.styles";
import MultiSelectPicker from "../MultiSelectPicker/MultiSelectPicker";
import RatingPicker from "../RatingPicker/RatingPicker";
import CollectionListDropdown from "../CollectionListDropdown/CollectionListDropdown";
import { ScrollView } from "react-native";
import { AttributeDTO } from "@/shared/dto/AttributeDTO";
import { CollectionCategoryDTO } from "@/shared/dto/CollectionCategoryDTO";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { AttributeType } from "@/shared/enum/AttributeType";
import LinkPicker from "../LinkPicker/LinkPicker";
import ImagePickerField from "../ImagePickerField/ImagePickerField";

/**
 * Component for adding a new item to a collection, dynamically rendering
 * input fields based on provided attributes.
 * @param attributes - Array of attributes defining the input fields.
 * @param lists (required) - Array of collection lists to choose from.
 * @param attributeValues (required) - Object mapping attribute IDs to their current values.
 * @param onInputChange (required) - Callback function to handle changes in input fields.
 * @param hasNoInputError - Optional flag to indicate if there are input errors.
 * @param onListChange (required) - Callback function to handle changes in the selected collection list.
 * @param selectedCategoryID - ID of the currently selected category.
 */

interface AddCollectionItemProps {
  attributes?: AttributeDTO[];
  lists: CollectionCategoryDTO[];
  attributeValues: Record<number, any>;
  onInputChange: (
    attributeID: number,
    value: any,
    displayText?: string,
    alText?: string,
  ) => void;
  hasNoInputError?: boolean;
  onListChange: (categoryID: number | null) => void;
  selectedCategoryID?: number | null;
}

const AddCollectionItemCard: FC<AddCollectionItemProps> = ({
  attributes,
  lists,
  attributeValues,
  onInputChange,
  onListChange,
  hasNoInputError,
  selectedCategoryID,
}) => {
  const colorScheme = useActiveColorScheme();
  const [selectedList, setSelectedList] = useState("");
  const [listStrings, setListStrings] = useState<string[]>([]);

  const [customLinkText, setCustomLinkText] = useState<{
    [id: number]: string;
  }>({});

  const [linkValues, setLinkValues] = useState<{
    [id: number]: string;
  }>({});

  const [customAltText, setCustomAltText] = useState<{ [id: number]: string }>(
    {},
  );
  const [imageUris, setImageUris] = useState<{ [id: number]: string }>({});

  const initializedRef = useRef(false);

  /**
   * Effect to initialize link attributes and their values
   * based on the provided attributes and attribute values.
   * This effect runs only once when the component mounts.
   */
  useEffect(() => {
    if (!attributes || initializedRef.current) return;

    const linkTextMap: { [id: number]: string } = {};
    const linkValueMap: { [id: number]: string } = {};
    let hasLinkAttributes = false;

    attributes.forEach((attribute) => {
      if (attribute.type === AttributeType.Link && attribute.attributeID) {
        hasLinkAttributes = true;
        const attributeId = Number(attribute.attributeID);
        const currentValue = attributeValues[attributeId];

        if (
          currentValue &&
          typeof currentValue === "object" &&
          "displayText" in currentValue
        ) {
          linkTextMap[attributeId] = currentValue.displayText || "";
          linkValueMap[attributeId] = currentValue.value || "";
        } else {
          linkTextMap[attributeId] = "";
          linkValueMap[attributeId] = "";
        }
      }
    });

    const altTextMap: { [id: number]: string } = {};
    const imageUriMap: { [id: number]: string } = {};

    attributes.forEach((attribute) => {
      if (attribute.type === AttributeType.Image && attribute.attributeID) {
        const attributeId = Number(attribute.attributeID);
        const currentValue = attributeValues[attributeId];

        if (currentValue && typeof currentValue === "object") {
          imageUriMap[attributeId] = currentValue.value || "";
          altTextMap[attributeId] = currentValue.altText || "";
        } else {
          imageUriMap[attributeId] = "";
          altTextMap[attributeId] = "";
        }
      }
    });

    setImageUris(imageUriMap);
    setCustomAltText(altTextMap);

    if (hasLinkAttributes) {
      setCustomLinkText(linkTextMap);
      setLinkValues(linkValueMap);
      initializedRef.current = true;
    }
  }, [attributes]);

  /**
   * Function to handle changes in the selected collection list.
   * It updates the selected list state and calls the onListChange callback
   * with the corresponding category ID.
   * @param value - The selected list name or ID.
   */
  const handleSelectionChange = (value: string | number) => {
    setSelectedList(String(value));

    if (!value) {
      onListChange(null);
      return;
    }

    const selectedCategory = lists.find((list) => list.category_name === value);

    if (selectedCategory) {
      const categoryId = selectedCategory.collectionCategoryID;

      if (categoryId != null) {
        onListChange(Number(categoryId));
      } else {
        console.error("ERROR: Category ID is null or undefined!");
      }
    }
  };

  /**
   * Effect to initialize the collection list
   * preselects based on the provided lists and selectedCategoryID,
   * if none is provided - it defaults to the first list.
   */
  useEffect(() => {
    if (!lists.length) return;

    const listArray: string[] = [];
    let matchedName = "";

    lists.forEach((list) => {
      listArray.push(list.category_name);
      if (
        selectedCategoryID != null &&
        Number(list.collectionCategoryID) === Number(selectedCategoryID)
      ) {
        matchedName = list.category_name;
      }
    });

    setListStrings(listArray);

    if (selectedCategoryID == null && lists[0]) {
      const defaultList = lists[0];
      const defaultName = defaultList.category_name;
      const defaultId =
        defaultList.collectionCategoryID ?? defaultList.collectionCategoryID;

      if (defaultId != null) {
        setSelectedList(defaultName);
        onListChange(Number(defaultId));
      }
    } else if (matchedName && matchedName !== selectedList) {
      setSelectedList(matchedName);
    }
  }, [lists, selectedCategoryID]);

  /**
   * Function to render the input fields based on the provided attributes.
   * It dynamically creates input components based on the attribute type.
   * Returned will be an array of React nodes representing the input fields.
   */
  const renderRepresentation = () => {
    const elements: React.ReactNode[] = [];
    let textfieldCount = 0;

    if (attributes) {
      attributes.forEach((attribute) => {
        const currentValue = attributeValues[Number(attribute.attributeID)];

        switch (attribute.type) {
          case AttributeType.Text:
            const isFirstTextfield = textfieldCount === 0;
            textfieldCount++;

            elements.push(
              <Textfield
                key={attribute.attributeID}
                title={attribute.attributeLabel}
                placeholderText="Add text"
                value={currentValue || ""}
                onChangeText={(text) =>
                  onInputChange(Number(attribute.attributeID), text)
                }
                {...(!elements[0] && { hasNoInputError })}
                maxLength={750}
                multiline={elements[0] ? true : false}
                isRequired={isFirstTextfield}
              />,
            );
            break;
          case AttributeType.Date:
            elements.push(
              <DateField
                key={attribute.attributeID}
                title={attribute.attributeLabel}
                value={currentValue || ""}
                onChange={(date) =>
                  onInputChange(Number(attribute.attributeID), date)
                }
              />,
            );
            break;
          case AttributeType.Rating:
            elements.push(
              <RatingPicker
                key={attribute.attributeID}
                title={attribute.attributeLabel}
                selectedIcon={
                  (attribute.symbol as keyof typeof MaterialIcons.glyphMap) ||
                  "star"
                }
                value={currentValue || 0}
                onChange={(rating) =>
                  onInputChange(Number(attribute.attributeID), rating)
                }
              />,
            );
            break;
          case AttributeType.Multiselect:
            if (attribute.options) {
              elements.push(
                <MultiSelectPicker
                  key={attribute.attributeID}
                  title={attribute.attributeLabel}
                  multiselectArray={attribute.options || []}
                  selectedTags={currentValue || []}
                  onSelectTag={(tag) => {
                    const prevSelected = currentValue || [];
                    const isAlreadySelected = prevSelected.includes(tag);
                    const updatedTags = isAlreadySelected
                      ? prevSelected.filter((t: string) => t !== tag)
                      : [...prevSelected, tag];

                    onInputChange(Number(attribute.attributeID), updatedTags);
                  }}
                />,
              );
            }
            break;
          case AttributeType.Link:
            const attributeId = Number(attribute.attributeID);
            elements.push(
              <LinkPicker
                key={attribute.attributeID}
                title={attribute.attributeLabel}
                value={linkValues[attributeId] || ""}
                onChange={(text) => {
                  setLinkValues((prev) => ({
                    ...prev,
                    [attributeId]: text,
                  }));

                  const currentDisplayText = customLinkText[attributeId] || "";
                  onInputChange(attributeId, text, currentDisplayText);
                }}
                linkText={customLinkText[attributeId] || ""}
                onLinkTextChange={(text) => {
                  setCustomLinkText((prev) => ({
                    ...prev,
                    [attributeId]: text,
                  }));

                  const currentLinkValue = linkValues[attributeId] || "";
                  onInputChange(attributeId, currentLinkValue, text);
                }}
              />,
            );
            break;
          case AttributeType.Image:
            const imageAttributeId = Number(attribute.attributeID);
            elements.push(
              <ImagePickerField
                key={imageAttributeId}
                title={attribute.attributeLabel}
                value={imageUris[imageAttributeId] || ""}
                onChange={(uri) => {
                  setImageUris((prev) => ({
                    ...prev,
                    [imageAttributeId]: uri,
                  }));
                  const currentAlt = customAltText[imageAttributeId] || "";
                  onInputChange(imageAttributeId, uri, undefined, currentAlt);
                }}
                altText={customAltText[imageAttributeId] || ""}
                onAltTextChange={(text) => {
                  setCustomAltText((prev) => ({
                    ...prev,
                    [imageAttributeId]: text,
                  }));
                  const currentUri = imageUris[imageAttributeId] || "";
                  onInputChange(imageAttributeId, currentUri, undefined, text);
                }}
              />,
            );
            break;
          default:
            break;
        }
      });
    }
    return elements;
  };

  return (
    <StyledCardWrapper colorScheme={colorScheme}>
      <ScrollView
        contentContainerStyle={{
          gap: 30,
        }}
        showsVerticalScrollIndicator={false}
      >
        <CollectionListDropdown
          title={"Select a List"}
          collectionList={listStrings}
          selectedList={selectedList}
          onSelectionChange={handleSelectionChange}
        />
        {renderRepresentation()}
      </ScrollView>
    </StyledCardWrapper>
  );
};

export default AddCollectionItemCard;
