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
import constructWithOptions from "styled-components/dist/constructors/constructWithOptions";

interface AddCollectionItemProps {
  attributes?: AttributeDTO[];
  lists: CollectionCategoryDTO[];
}

const AddCollectionItemCard: FC<AddCollectionItemProps> = ({
  attributes,
  lists,
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
        switch (attribute.type) {
          case AttributeType.Text:
            elements.push(
              <Textfield
                key={attribute.attributeID}
                title={attribute.attributeLabel}
                placeholderText="Add text here"
              />,
            );
            break;
          case AttributeType.Date:
            elements.push(
              <DateField
                key={attribute.attributeID}
                title={attribute.attributeLabel}
              />,
            );
            break;
          case AttributeType.Rating:
            elements.push(
              <RatingPicker
                key={attribute.attributeID}
                title={attribute.attributeLabel}
                selectedIcon={attribute.symbol || "star"}
              />,
            );
            break;
          case AttributeType.Multiselect:
            if (attribute.options) {
              elements.push(
                <MultiSelectPicker
                  key={attribute.attributeID}
                  title={attribute.attributeLabel}
                  multiselectArray={attribute.options}
                  selectedTags={selectedTags[attribute.attributeLabel] || []}
                  onSelectTag={(tag) =>
                    handleTagSelect(attribute.attributeLabel, tag)
                  }
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
