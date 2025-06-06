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

interface AddCollectionItemProps {
  attributes?: AttributeDTO[];
  lists: CollectionCategoryDTO[];
  attributeValues: Record<number, any>;
  onInputChange: (
    attributeID: number,
    value: any,
    displayText?: string,
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
  const [selectedTags, setSelectedTags] = useState<Record<string, string[]>>(
    {},
  );

  const [customLinkText, setCustomLinkText] = useState<{
    [id: number]: string;
  }>({});

  const [linkValues, setLinkValues] = useState<{
    [id: number]: string;
  }>({});

  const initializedRef = useRef(false);

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

    if (hasLinkAttributes) {
      setCustomLinkText(linkTextMap);
      setLinkValues(linkValueMap);
      initializedRef.current = true;
    }
  }, [attributes]);

  const handleTagSelect = (attributeLabel: string, tag: string) => {
    setSelectedTags((prev) => {
      const currentTags = prev[attributeLabel] || [];
      const isAlreadySelected = currentTags.includes(tag);
      const updatedTags = isAlreadySelected
        ? currentTags.filter((t) => t !== tag)
        : [...currentTags, tag];

      return {
        ...prev,
        [attributeLabel]: updatedTags,
      };
    });
  };

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

  const renderRepresentation = () => {
    const elements: React.ReactNode[] = [];

    if (attributes) {
      attributes.forEach((attribute) => {
        const currentValue = attributeValues[Number(attribute.attributeID)];

        switch (attribute.type) {
          case AttributeType.Text:
            elements.push(
              <Textfield
                key={attribute.attributeID}
                title={attribute.attributeLabel}
                placeholderText="Add text here"
                value={currentValue || ""}
                onChangeText={(text) =>
                  onInputChange(Number(attribute.attributeID), text)
                }
                {...(!elements[0] && { hasNoInputError })}
                maxLength={750}
                multiline={elements[0] ? true : false}
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
            elements.push(
              <ImagePickerField
                key={attribute.attributeID}
                title={attribute.attributeLabel}
                value={currentValue || ""}
                onChange={(uri) =>
                  onInputChange(Number(attribute.attributeID), uri)
                }
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
