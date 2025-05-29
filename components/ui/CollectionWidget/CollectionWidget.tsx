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

const CollectionWidget: React.FC<CollectionWidgetProps> = ({
  attributes,
  item,
  onPress,
  onLongPress,
}) => {
  const colorScheme = useActiveColorScheme() ?? "light";

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
  const imageIndex = attributes.findIndex((attr) => attr.type === "image");
  const linkIndex = attributes.findIndex((attr) => attr.type === "link");

  // Get values
  const title = titleIndex !== -1 ? item.values[titleIndex] : "";
  const text = textIndex !== -1 ? item.values[textIndex] : null;
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
  const getValidUrl = (url: string): string => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return "https://" + url;
    }
    return url;
  };
  const handlePressLink = async () => {
    if (!link) return;
    const validUrl = getValidUrl(link);
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

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      onLongPress={handleLongPress}
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
          {text && (
            <CollectionText colorScheme={colorScheme} numberOfLines={3}>
              {text}
            </CollectionText>
          )}
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
                    color="#E7C716"
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
                <MaterialIcons name="attach-file" size={20} color="#2980ff" />
                <ThemedText
                  fontWeight="regular"
                  fontSize="s"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    color: "#2980ff",
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
