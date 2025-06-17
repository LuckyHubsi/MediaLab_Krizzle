import React, { FC } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Linking,
  Alert,
} from "react-native";
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

/**
 * Component for displaying a collection item inside the collection list card.
 * It shows various attributes like title, date, rating, multi-select options,
 * @param attributes (required) - Array of attributes for the collection item.
 * @param item (required) - The collection item containing values for the attributes.
 * @param onPress - Optional callback for item press action.
 * @param onLongPress - Optional callback for item long press action.
 */

type Item = {
  itemID: number;
  values: any[];
};

type CollectionWidgetProps = {
  attributes: AttributeDTO[];
  item: Item;
  onPress?: () => void;
  onLongPress?: () => void;
};

const CollectionWidget: FC<CollectionWidgetProps> = ({
  attributes,
  item,
  onPress,
  onLongPress,
}) => {
  const colorScheme = useActiveColorScheme() ?? "light";

  // Find indexes for each type (title, date, rating, multi-select, image, link)
  const titleIndex = attributes.findIndex((attr) => attr.type === "text");
  const dateIndex = attributes.findIndex((attr) => attr.type === "date");
  const ratingIndex = attributes.findIndex((attr) => attr.type === "rating");
  const multiSelectIndex = attributes.findIndex(
    (attr) => attr.type === "multi-select",
  );
  const imageIndex = attributes.findIndex((attr) => attr.type === "image");
  const linkIndex = attributes.findIndex((attr) => attr.type === "link");

  // Get values for each attribute type or set to default if not present (-1)
  const title = titleIndex !== -1 ? item.values[titleIndex] : "";
  const date = dateIndex !== -1 ? item.values[dateIndex] : null;
  const rating = ratingIndex !== -1 ? item.values[ratingIndex] : null;
  const multiSelect =
    multiSelectIndex !== -1 ? item.values[multiSelectIndex] : [];
  const image = imageIndex !== -1 ? item.values[imageIndex] : null;
  const link = linkIndex !== -1 ? item.values[linkIndex] : null;
  const linkValue =
    link && typeof link === "object" && link.value ? link.value : null;
  const linkPreview =
    link && typeof link === "object" && link.displayText
      ? link.displayText
      : null;

  /**
   * Function to validate and format a URL.
   * @param url - The URL to validate.
   * @returns
   */
  const getValidUrl = (url: string): string => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return "https://" + url;
    }
    return url;
  };

  /**
   * Function to handle link press.
   * It checks if the link is valid and opens it using the device's default browser.
   * If the link cannot be opened, it shows an alert.
   */
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

  /**
   * Function to handle long press action.
   * If onLongPress callback is provided, it calls that function.
   */
  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress();
    } else {
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      onLongPress={handleLongPress}
    >
      <CollectionCardContainer colorScheme={colorScheme}>
        {/* Display image if available */}
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
              source={{ uri: image }}
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
          {/* Display Date and Rating if available */}
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

              {/* Display Rating (right) */}
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
          {/* Display Link if available */}
          {link && (
            <TouchableOpacity onPress={handlePressLink}>
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
          {/* Display selected multi-selects if available */}
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
