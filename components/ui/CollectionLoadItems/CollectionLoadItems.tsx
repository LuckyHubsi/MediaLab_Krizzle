import { useState } from "react";
import { ScrollView, View, Dimensions } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ItemAttributeValueDTO } from "@/shared/dto/ItemAttributeValueDTO";
import { parseISO } from "date-fns";
import { AttributeType } from "@/shared/enum/AttributeType";
import CollectionItemContainer from "../CollectionItemContainer/CollectionItemContainer";
import { Colors } from "@/constants/Colors";

/**
 * Component for displaying a collection item with various optional attributes.
 * It supports images (with alt text), titles, multiselect options, dates, ratings, links, and text.
 * @param attributeValues - An array of item attribute values to display.
 */

interface CollectionLoadItemProps {
  attributeValues?: ItemAttributeValueDTO[];
}

export const CollectionLoadItem: React.FC<CollectionLoadItemProps> = ({
  attributeValues,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  /**
   * Function to render the collection item representation based on the provided attributes
   * (images, titles, multiselects, dates, ratings, links, and text attributes.
   */
  const renderRepresentation = () => {
    if (!attributeValues || attributeValues.length === 0) return null;

    const elements: React.ReactNode[] = [];

    // Filter and render image attributes
    const imageAttribute = attributeValues.filter(
      (attr) =>
        attr.type === AttributeType.Image &&
        "valueString" in attr &&
        attr.valueString,
    );
    if (imageAttribute.length > 0) {
      elements.push(
        <View
          key={`img-wrapper-${imageAttribute.map((i) => i.attributeID).join("-")}`}
          style={{ height: 450 }}
        >
          <ScrollView
            contentContainerStyle={{ height: 400, gap: 16 }}
            horizontal
            onScroll={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / (screenWidth - 24),
              );
              setCurrentImageIndex(index);
            }}
            scrollEventThrottle={16}
            snapToInterval={screenWidth - 24}
            decelerationRate="fast"
            alwaysBounceHorizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {imageAttribute.map((multi) => (
              <View
                key={`img-${multi.attributeID}`}
                style={{ height: 400, gap: 16 }}
              >
                <CollectionItemContainer
                  subtitle={multi.attributeLabel}
                  imageUri={"valueString" in multi ? multi.valueString : ""}
                  altText={
                    "altText" in multi && multi.altText ? multi.altText : ""
                  }
                />
              </View>
            ))}
          </ScrollView>
          {imageAttribute.length > 1 && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              {imageAttribute.map((img, idx) => (
                <View
                  key={`img-dot-${img.attributeID}`}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    marginHorizontal: 4,
                    backgroundColor:
                      idx === currentImageIndex ? Colors.primary : "#ccc",
                  }}
                />
              ))}
            </View>
          )}
        </View>,
      );
    }

    // Filter and render title attribute
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

    // Filter and render multiselect attributes
    const multiSelect = attributeValues.filter(
      (attr) =>
        attr.type === AttributeType.Multiselect &&
        "valueMultiselect" in attr &&
        Array.isArray(attr.valueMultiselect) &&
        attr.valueMultiselect.length > 0,
    );
    multiSelect.forEach((multi) => {
      elements.push(
        <CollectionItemContainer
          key={`multi-${multi.attributeID}`}
          subtitle={multi.attributeLabel}
          multiselectArray={
            "valueMultiselect" in multi && Array.isArray(multi.valueMultiselect)
              ? multi.valueMultiselect
              : undefined
          }
        />,
      );
    });

    // Filter and render date and rating attributes
    const dateAttr = attributeValues.filter(
      (attr) =>
        attr.type === AttributeType.Date &&
        "valueString" in attr &&
        attr.valueString,
    );
    const ratingAttr = attributeValues.filter(
      (attr) =>
        attr.type === AttributeType.Rating &&
        "valueNumber" in attr &&
        attr.valueNumber,
    );
    if (dateAttr || ratingAttr) {
      elements.push(
        <View
          key="date-rating-container"
          style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}
        >
          {dateAttr &&
            dateAttr.map((date) => (
              <CollectionItemContainer
                key={`date-${date.attributeID}`}
                subtitle={date.attributeLabel}
                icon="calendar-month"
                date={
                  "valueString" in date && date.valueString
                    ? parseISO(date.valueString)
                    : undefined
                }
              />
            ))}
          {ratingAttr &&
            ratingAttr.map((rating) => (
              <CollectionItemContainer
                key={`rating-${rating.attributeID}`}
                subtitle={rating.attributeLabel}
                icon={
                  (rating.symbol as keyof typeof MaterialIcons.glyphMap) ||
                  "default-icon"
                }
                iconColor="#E7C716"
                type={`${"valueNumber" in rating ? rating.valueNumber || 0 : 0}/5`}
              />
            ))}
        </View>,
      );
    }

    // Filter and render link attributes
    const linkAttributes = attributeValues.filter(
      (attr) =>
        attr.type === AttributeType.Link &&
        "valueString" in attr &&
        attr.valueString,
    );
    linkAttributes.forEach((link) => {
      elements.push(
        <CollectionItemContainer
          key={`link-${link.attributeID}`}
          subtitle={link.attributeLabel}
          link={"valueString" in link ? link.valueString : ""}
          linkPreview={"displayText" in link ? link.displayText : ""}
        />,
      );
    });

    // Filter and render text attributes
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
