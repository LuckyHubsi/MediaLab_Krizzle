import { useState } from "react";
import Textfield from "../Textfield/Textfield";
import DateField from "../DateField/DateField";
import { StyledCardWrapper } from "./CollectionLoadItems.stlyle";
import MultiSelectPicker from "../MultiSelectPicker/MultiSelectPicker";
import RatingPicker from "../RatingPicker/RatingPicker";
import { useRouter } from "expo-router";
import { View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ListCOntainer } from "./CollectionLoadItems.stlyle";
import { ThemedText } from "@/components/ThemedText";
import CollectionTextfield from "../CollectionTextField/CollectionTextField";
import { ItemAttributeValueDTO } from "@/shared/dto/ItemAttributeValueDTO";
import { parseISO } from "date-fns";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { AttributeType } from "@/shared/enum/AttributeType";
import CollectionItemContainer from "../CollectionItemContainer/CollectionItemContainer";

interface CollectionLoadItemProps {
  attributeValues?: ItemAttributeValueDTO[];
  listName?: string;
}

export const CollectionLoadItem: React.FC<CollectionLoadItemProps> = ({
  attributeValues,
  listName,
}) => {
  const router = useRouter();
  const colorScheme = useActiveColorScheme();
  const [selectedList, setSelectedList] = useState("");

  const handleSelectionChange = (value: string) => {
    setSelectedList(value);
  };

  const renderRepresentation = () => {
    if (!attributeValues || attributeValues.length === 0) return null;

    const elements: React.ReactNode[] = [];

    const imageAttribute = attributeValues.find(
      (attr) =>
        attr.type === AttributeType.Image &&
        "valueString" in attr &&
        attr.valueString,
    );
    if (imageAttribute) {
      elements.push(
        <CollectionItemContainer
          key={`title-${imageAttribute.attributeID}`}
          subtitle={imageAttribute.attributeLabel}
          imageUri={
            "valueString" in imageAttribute ? imageAttribute.valueString : ""
          }
        />,
      );
    }

    const titleAttribute = attributeValues.find(
      (attr) => "valueString" in attr && attr.valueString,
    );
    if (titleAttribute) {
      elements.push(
        <CollectionItemContainer
          key={`title-${titleAttribute.attributeID}`}
          subtitle={titleAttribute.attributeLabel}
          title={
            "valueString" in titleAttribute ? titleAttribute.valueString : ""
          }
        />,
      );
    }

    const multiSelect = attributeValues.find(
      (attr) =>
        attr.type === AttributeType.Multiselect &&
        "valueMultiselect" in attr &&
        attr.valueMultiselect &&
        attr.valueMultiselect.length > 0,
    );
    if (multiSelect) {
      elements.push(
        <CollectionItemContainer
          key={`multi-${multiSelect.attributeID}`}
          subtitle={multiSelect.attributeLabel}
          multiselectArray={
            "valueMultiselect" in multiSelect &&
            Array.isArray(multiSelect.valueMultiselect)
              ? multiSelect.valueMultiselect
              : undefined
          }
        />,
      );
    }

    const dateAttr = attributeValues.find(
      (attr) =>
        attr.type === AttributeType.Date &&
        "valueString" in attr &&
        attr.valueString,
    );
    const ratingAttr = attributeValues.find(
      (attr) => attr.type === AttributeType.Rating,
    );

    if (dateAttr || ratingAttr) {
      elements.push(
        <View
          key="horizontal-group"
          style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}
        >
          {dateAttr && (
            <CollectionItemContainer
              key={`date-${dateAttr.attributeID}`}
              subtitle={dateAttr.attributeLabel}
              icon="calendar-month"
              date={
                "valueString" in dateAttr && dateAttr.valueString
                  ? parseISO(dateAttr.valueString)
                  : undefined
              }
            />
          )}
          {ratingAttr && (
            <CollectionItemContainer
              key={`rating-${ratingAttr.attributeID}`}
              subtitle={ratingAttr.attributeLabel}
              icon={
                (ratingAttr.symbol as keyof typeof MaterialIcons.glyphMap) ||
                "default-icon"
              }
              iconColor="#E7C716"
              type={`${"valueNumber" in ratingAttr ? ratingAttr.valueNumber || 0 : 0}/5`}
            />
          )}
        </View>,
      );
    }

    const linkAttribute = attributeValues.find(
      (attr) =>
        attr.type === AttributeType.Link &&
        "valueString" in attr &&
        attr.valueString,
    );
    if (linkAttribute) {
      elements.push(
        <CollectionItemContainer
          key={`title-${linkAttribute.attributeID}`}
          subtitle={linkAttribute.attributeLabel}
          link={"valueString" in linkAttribute ? linkAttribute.valueString : ""}
          linkPreview={
            "displayText" in linkAttribute ? linkAttribute.displayText : ""
          }
        />,
      );
    }

    const descriptionTexts = attributeValues.filter(
      (attr) =>
        attr.type === AttributeType.Text &&
        "valueString" in attr &&
        attr.valueString &&
        attr !== titleAttribute,
    );
    descriptionTexts.forEach((desc) => {
      elements.push(
        <CollectionItemContainer
          key={`desc-${desc.attributeID}`}
          subtitle={desc.attributeLabel}
          type={
            "valueString" in desc && desc.valueString ? desc.valueString : ""
          }
        />,
      );
    });

    return elements;
  };

  return <>{renderRepresentation()}</>;
};

export default CollectionLoadItem;
