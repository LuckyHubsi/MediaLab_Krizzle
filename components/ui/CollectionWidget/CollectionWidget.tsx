import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  CollectionCardContainer,
  CollectionText,
  CollectionRating,
  CollectionTitle,
  CollectionSelectable,
} from "./CollectionWidget.style";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Attribute = {
  attributeID: number;
  attributeLabel: string;
  type: string;
  preview: boolean;
};

type Item = {
  itemID: number;
  values: any[];
};

type CollectionWidgetProps = {
  attributes: Attribute[];
  item: Item;
  onPress?: () => void;
};

const CollectionWidget: React.FC<CollectionWidgetProps> = ({
  attributes,
  item,
  onPress,
}) => {
  const colorScheme = useColorScheme() ?? "light";

  // Find indexes for each type
  const titleIndex = attributes.findIndex((attr) => attr.type === "text");
  const textIndex = attributes.findIndex(
    (attr, idx) => attr.type === "text" && idx !== titleIndex,
  );
  const dateIndex = attributes.findIndex((attr) => attr.type === "date");
  const ratingIndex = attributes.findIndex((attr) => attr.type === "rating");
  const multiSelectIndex = attributes.findIndex(
    (attr) => attr.type === "multi-select",
  );

  // Get values
  const title = titleIndex !== -1 ? item.values[titleIndex] : "";
  const text = textIndex !== -1 ? item.values[textIndex] : null;
  const date = dateIndex !== -1 ? item.values[dateIndex] : null;
  const rating = ratingIndex !== -1 ? item.values[ratingIndex] : null;
  const multiSelect =
    multiSelectIndex !== -1 ? item.values[multiSelectIndex] : [];

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <CollectionCardContainer colorScheme={colorScheme}>
        {/* Title */}
        <CollectionTitle colorScheme={colorScheme}>{title}</CollectionTitle>

        {/* Text preview */}
        {text && (
          <CollectionText colorScheme={colorScheme}>{text}</CollectionText>
        )}

        {/* Date and Rating */}
        {(date || rating) && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              marginTop: 8,
            }}
          >
            {/* Date (left) */}
            {date ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons
                  name="calendar-today"
                  size={24}
                  color={colorScheme === "light" ? "#585858" : "#ABABAB"}
                  style={{ marginRight: 6 }}
                />
                <CollectionRating colorScheme={colorScheme}>
                  {new Date(date).toLocaleDateString()}
                </CollectionRating>
              </View>
            ) : (
              <View />
            )}

            {/* Rating (right) */}
            {rating ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons
                  name="star"
                  size={24}
                  color="#E7C716"
                  style={{ marginRight: 6 }}
                />
                <CollectionRating colorScheme={colorScheme}>
                  {rating + "/5"}
                </CollectionRating>
              </View>
            ) : (
              <View />
            )}
          </View>
        )}

        {/* Multi-Select */}
        {multiSelect &&
          Array.isArray(multiSelect) &&
          multiSelect.length > 0 && (
            <View
              style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}
            >
              {multiSelect.map((option: string, index: number) => (
                <CollectionSelectable colorScheme={colorScheme} key={index}>
                  <Text>{option}</Text>
                </CollectionSelectable>
              ))}
            </View>
          )}
      </CollectionCardContainer>
    </TouchableOpacity>
  );
};

export default CollectionWidget;
