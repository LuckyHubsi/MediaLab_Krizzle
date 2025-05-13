import { FC, useEffect, useState } from "react";
import Textfield from "../Textfield/Textfield";
import DateField from "../DateField/DateField";
import { StyledCardWrapper } from "./AddCollectionItemCard.styles";
import MultiSelectPicker from "../MultiSelectPicker/MultiSelectPicker";
import RatingPicker from "../RatingPicker/RatingPicker";
import CollectionListDropdown from "../CollectionListDropdown/CollectionListDropdown";
import { ScrollView } from "react-native";
import { AttributeDTO } from "@/dto/AttributeDTO";
import { AttributeType } from "@/utils/enums/AttributeType";
import { CollectionCategoryDTO } from "@/dto/CollectionCategoryDTO";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";

interface AddCollectionItemProps {
  attributes?: AttributeDTO[];
  lists: CollectionCategoryDTO[];
  attributeValues: Record<number, any>;
  onInputChange: (attributeID: number, value: any) => void;
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

  const handleSelectionChange = (value: string) => {
    setSelectedList(value);

    if (!value) {
      onListChange(null);
      return;
    }

    const selectedCategory = lists.find((list) => list.category_name === value);

    if (selectedCategory) {
      const categoryIdProperty =
        "collection_categoryID" in selectedCategory
          ? "collection_categoryID"
          : "collectionCategoryID" in selectedCategory
            ? "collectionCategoryID"
            : null;

      if (!categoryIdProperty) {
        console.error(
          "ERROR: Category object doesn't have a valid ID property!",
          selectedCategory,
        );
        return;
      }

      const categoryId = selectedCategory[categoryIdProperty];

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
        Number(list.collection_categoryID) === Number(selectedCategoryID)
      ) {
        matchedName = list.category_name;
      }
    });

    setListStrings(listArray);

    if (matchedName && matchedName !== selectedList) {
      setSelectedList(matchedName);
    }
  }, [lists, selectedCategoryID]);

  const renderRepresentation = () => {
    const elements: React.ReactNode[] = [];
    let firstTextfieldAdded = false;

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
                {...(!firstTextfieldAdded && { hasNoInputError })}
                maxLength={750}
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
