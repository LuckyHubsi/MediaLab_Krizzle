import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Linking,
  Alert,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  CollectionCardContainer,
  CollectionText,
  CollectionRating,
  CollectionSelectable,
} from "./CollectionWidget.style";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { AttributeDTO } from "@/shared/dto/AttributeDTO";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "react-native/Libraries/NewAppScreen";

type Item = {
  itemID: number;
  values: any[];
  itemCountPerList: number;
};

type CollectionWidgetProps = {
  attributes: AttributeDTO[];
  item: Item;
  onPress?: () => void;
  onLongPress?: () => void;
  index: number;
  itemCountPerList: number;
  list: string;
};

const CollectionWidget: React.FC<CollectionWidgetProps> = ({
  attributes,
  item,
  onPress,
  onLongPress,
  index,
  itemCountPerList,
  list,
}) => {
  const colorScheme = useActiveColorScheme() ?? "light";

  // Find indexes for each type
  const titleIndex = attributes.findIndex((attr) => attr.type === "text");
  const dateIndex = attributes.findIndex((attr) => attr.type === "date");
  const ratingIndex = attributes.findIndex((attr) => attr.type === "rating");
  const multiSelectIndex = attributes.findIndex(
    (attr) => attr.type === "multi-select",
  );
  const imageIndex = attributes.findIndex((attr) => attr.type === "image");
  const linkIndex = attributes.findIndex((attr) => attr.type === "link");

  // Get values
  const title = titleIndex !== -1 ? item.values[titleIndex] : "";
  const date = dateIndex !== -1 ? item.values[dateIndex] : null;
  const rating = ratingIndex !== -1 ? item.values[ratingIndex] : null;
  const multiSelect =
    multiSelectIndex !== -1 ? item.values[multiSelectIndex] : [];
  const image = imageIndex !== -1 ? item.values[imageIndex] : null;
  const imageValue =
    image && typeof image === "object" && image.value ? image.value : null;
  const imagePreview =
    image && typeof image === "object" && image.altText ? image.altText : null;
  const link = linkIndex !== -1 ? item.values[linkIndex] : null;
  const linkValue =
    link && typeof link === "object" && link.value ? link.value : null;
  const linkPreview =
    link && typeof link === "object" && link.displayText
      ? link.displayText
      : null;
  const getValidUrl = (url: string): string => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return "https://" + url;
    }
    return url;
  };
  const handlePressLink = async () => {
    if (!link.value) return;
    const validUrl = getValidUrl(link.value);
    const supported = await Linking.canOpenURL(validUrl);
    if (supported) {
      await Linking.openURL(validUrl);
    } else {
      Alert.alert("Can't open this URL:", validUrl);
    }
  };

  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress();
    } else {
    }
  };

  function buildAccessibilityLabel(
    attributes: AttributeDTO[],
    values: any[],
  ): string {
    const parts: string[] = [];

    const addedIndices = new Set<number>();

    // Find all text attribute indices
    const textIndices = attributes
      .map((attr, idx) => ({ ...attr, idx }))
      .filter((attr) => attr.type === "text");

    if (textIndices.length > 0) {
      const titleAttr = textIndices[0];
      const titleVal = values[titleAttr.idx];
      if (titleVal) {
        parts.push(
          `Label ${titleAttr.attributeLabel} with value ${titleVal}. `,
        );
        addedIndices.add(titleAttr.idx);
      }

      // Add remaining text fields (not title)
      for (let i = 1; i < textIndices.length; i++) {
        const attr = textIndices[i];
        const val = values[attr.idx];
        if (val) {
          parts.push(`Label ${attr.attributeLabel} with value ${val}. `);
          addedIndices.add(attr.idx);
        }
      }
    }

    // Helper for adding remaining types
    const addByType = (type: string) => {
      for (let i = 0; i < attributes.length; i++) {
        if (attributes[i].type === type && !addedIndices.has(i)) {
          const label = attributes[i].attributeLabel ?? type;
          const val = values[i];

          if (val === null || val === undefined || val === "") continue;

          let readableValue = "";

          if (type === "date") {
            try {
              readableValue = new Date(val).toLocaleDateString();
            } catch {
              readableValue = val.toString();
            }
          } else if (type === "multi-select" && Array.isArray(val)) {
            readableValue = val.join(", ");
          } else if (type === "link" && typeof val === "object") {
            readableValue = val.displayText || val.value || "";
          } else if (type === "image" && typeof val === "object") {
            readableValue = val.altText
              ? val.altText
              : "No image description was provided";
          } else {
            readableValue = val.toString();
          }

          if (readableValue) {
            parts.push(`Label ${label} with value ${readableValue}. `);
            addedIndices.add(i);
          }

          break; // only one per type, as per order
        }
      }
    };

    addByType("image");
    addByType("date");
    addByType("rating");
    addByType("link");
    addByType("multi-select");

    return parts.join(", ");
  }
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      onLongPress={handleLongPress}
      accessible={true}
      accessibilityLabel={`${title}. Item content: ${buildAccessibilityLabel(attributes, item.values)}.  Item ${index + 1} out of ${itemCountPerList} in collection list ${list}.`}
      accessibilityHint="Activating navigates to the Collection Item Page. Longpress opens quick action modal"
    >
      <CollectionCardContainer colorScheme={colorScheme}>
        {image && (
          <View
            style={{
              height: 100,
              width: 90,
              borderRadius: 16,
              overflow: "hidden",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: imageValue }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",
              }}
            />
          </View>
        )}
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          {/* Title */}
          <ThemedText fontWeight="bold" fontSize="regular">
            {title}
          </ThemedText>
          {/* Text preview */}
          {attributes.map((attr, idx) => {
            if (attr.type === "text" && idx !== titleIndex) {
              const value = item.values[idx];
              if (typeof value === "string" && value.trim() !== "") {
                return (
                  <CollectionText
                    key={attr.attributeID}
                    colorScheme={colorScheme}
                    numberOfLines={3}
                  >
                    {value}
                  </CollectionText>
                );
              }
            }
            return null;
          })}
          {/* Date and Rating */}
          {(date !== null && date !== undefined) ||
          (rating !== null && rating !== undefined) ? (
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
              {date && (
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
              )}

              {/* Rating (right) */}
              {rating !== null && rating !== undefined ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MaterialIcons
                    name={
                      (attributes[ratingIndex]
                        .symbol as keyof typeof MaterialIcons.glyphMap) ||
                      "star"
                    }
                    size={24}
                    color={colorScheme === "light" ? "#176BBA" : "#4599E8"}
                    style={{ marginRight: 6 }}
                  />
                  <CollectionRating colorScheme={colorScheme}>
                    {rating + "/5"}
                  </CollectionRating>
                </View>
              ) : null}
            </View>
          ) : null}
          {link && (
            <TouchableOpacity
              onPress={handlePressLink}
              accessible={true}
              accessibilityRole="link"
              accessibilityLabel={linkPreview || linkValue}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  marginTop: -8,
                  width: "100%",
                }}
              >
                <MaterialIcons
                  name="attach-file"
                  size={20}
                  color={colorScheme === "light" ? "#176BBA" : "#4599E8"}
                />
                <ThemedText
                  fontWeight="regular"
                  fontSize="s"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: colorScheme === "light" ? "#176BBA" : "#4599E8",
                    textDecorationLine: "underline",
                    height: 48,
                    textAlignVertical: "center",
                  }}
                >
                  {linkPreview || linkValue}
                </ThemedText>
              </View>
            </TouchableOpacity>
          )}
          {/* Multi-Select */}
          {multiSelect &&
            Array.isArray(multiSelect) &&
            multiSelect.length > 0 && (
              <View
                style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}
              >
                {multiSelect.map((option: string) => (
                  <CollectionSelectable colorScheme={colorScheme} key={option}>
                    <Text>{option}</Text>
                  </CollectionSelectable>
                ))}
              </View>
            )}
        </View>
      </CollectionCardContainer>
    </TouchableOpacity>
  );
};

export default CollectionWidget;
