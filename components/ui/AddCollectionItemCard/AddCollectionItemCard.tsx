import { FC, useEffect, useState } from "react";
import Textfield from "../Textfield/Textfield";
import DateField from "../DateField/DateField";
import { StyledCardWrapper } from "./AddCollectionItemCard.styles";
import { useColorScheme } from "@/hooks/useColorScheme";
import MultiSelectPicker from "../MultiSelectPicker/MultiSelectPicker";
import RatingPicker from "../RatingPicker/RatingPicker";
import CollectionListDropdown from "../CollectionListDropdown/CollectionListDropdown";
import { ScrollView } from "react-native";
import { AttributeDTO } from "@/dto/AttributeDTO";
import { AttributeType } from "@/utils/enums/AttributeType";
import { CollectionCategoryDTO } from "@/dto/CollectionCategoryDTO";

interface AddCollectionItemProps {
  attributes?: AttributeDTO[];
  lists: CollectionCategoryDTO[];
  attributeValues: Record<number, any>;
  onInputChange: (attributeID: number, value: any) => void;
  onListChange: (categoryID: number) => void;
}

const AddCollectionItemCard: FC<AddCollectionItemProps> = ({
  attributes,
  lists,
  attributeValues,
  onInputChange,
  onListChange,
}) => {
  const colorScheme = useColorScheme();
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

    const selectedListDTO = lists.find((list) => list.category_name === value);

    if (selectedListDTO && selectedListDTO.collectionCategoryID) {
      onListChange(selectedListDTO.collectionCategoryID);
    }
  };

  useEffect(() => {
    const listArray: string[] = [];
    lists.forEach((list) => {
      listArray.push(list.category_name);
    });
    setListStrings(listArray);
  }, [lists]);

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
                selectedIcon={attribute.symbol || "star"}
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
