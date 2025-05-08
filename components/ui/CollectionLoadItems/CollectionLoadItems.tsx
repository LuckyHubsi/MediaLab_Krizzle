import { FC, useState } from "react";
import Textfield from "../Textfield/Textfield";
import DateField from "../DateField/DateField";
import { StyledCardWrapper } from "./CollectionLoadItems.stlyle";
import { useColorScheme } from "@/hooks/useColorScheme";
import MultiSelectPicker from "../MultiSelectPicker/MultiSelectPicker";
import RatingPicker from "../RatingPicker/RatingPicker";
import CollectionListDropdown from "../CollectionListDropdown/CollectionListDropdown";
import { useNavigation, useRouter } from "expo-router";
import { View } from "react-native";
import { Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ListCOntainer } from "./CollectionLoadItems.stlyle";
import { CollectionListText } from "../CollectionList/CollectionList.style";
import { ThemedText } from "@/components/ThemedText";
import CollectionTextfield from "../CollectionTextField/CollectionTextField";
import { ItemAttributeValueDTO } from "@/dto/ItemAttributeValueDTO";
import { AttributeType } from "@/utils/enums/AttributeType";
import { parseISO } from "date-fns";

interface CollectionLoadItemProps {
  attributeValues?: ItemAttributeValueDTO[];
  listName?: string;
}

export const CollectionLoadItem: React.FC<CollectionLoadItemProps> = ({
  attributeValues,
  listName,
}) => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [selectedList, setSelectedList] = useState("");

  const handleSelectionChange = (value: string) => {
    setSelectedList(value);
  };

  const renderRepresentation = () => {
    const elements: React.ReactNode[] = [];
    if (attributeValues) {
      attributeValues.forEach((attributeValue) => {
        if (attributeValue == attributeValues[0]) {
          if ("valueString" in attributeValue && attributeValue.valueString) {
            elements.push(
              <Textfield
                key={attributeValue.attributeID}
                title={attributeValue.attributeLabel}
                placeholderText={attributeValue.valueString}
                editable={false}
              />,
            );
          }
        } else {
          switch (attributeValue.type) {
            case AttributeType.Text:
              if (
                "valueString" in attributeValue &&
                attributeValue.valueString
              ) {
                elements.push(
                  <CollectionTextfield
                    key={attributeValue.attributeID}
                    title={attributeValue.attributeLabel}
                    placeholderText={attributeValue.valueString}
                    editable={false}
                  ></CollectionTextfield>,
                );
              }
              break;
            case AttributeType.Date:
              if (
                "valueString" in attributeValue &&
                attributeValue.valueString
              ) {
                elements.push(
                  <DateField
                    key={attributeValue.attributeID}
                    title={attributeValue.attributeLabel}
                    editable={false}
                    value={parseISO(attributeValue.valueString)}
                  />,
                );
              }
              break;
            case AttributeType.Rating:
              elements.push(
                <RatingPicker
                  key={attributeValue.attributeID}
                  title="Rating"
                  selectedIcon={
                    attributeValue.symbol as keyof typeof MaterialIcons.glyphMap
                  }
                  editable={false}
                  value={
                    "valueNumber" in attributeValue
                      ? attributeValue.valueNumber || 0
                      : 0
                  }
                ></RatingPicker>,
              );
              break;
            case AttributeType.Multiselect:
              if (
                attributeValue.options &&
                "valueMultiselect" in attributeValue &&
                attributeValue.valueMultiselect &&
                attributeValue.valueMultiselect.length !== 0
              ) {
                elements.push(
                  <MultiSelectPicker
                    key={attributeValue.attributeID}
                    title={attributeValue.attributeLabel}
                    multiselectArray={attributeValue.valueMultiselect}
                    selectedTags={attributeValue.valueMultiselect}
                    onSelectTag={() => {}}
                  />,
                );
              }
              break;
            default:
              break;
          }
        }
      });
    }
    return elements;
  };

  return (
    <StyledCardWrapper colorScheme={colorScheme}>
      {/* //List */}
      <ListCOntainer>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "nowrap",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialIcons
            name="format-list-bulleted"
            size={16}
            color="#FFFFFF"
            style={{ marginRight: 10 }}
          />
          <ThemedText
            fontSize="regular"
            fontWeight="regular"
            colorVariant="white"
          >
            {listName}
          </ThemedText>
        </View>
      </ListCOntainer>
      {renderRepresentation()}
    </StyledCardWrapper>
  );
};

export default CollectionLoadItemProps;
