import { ThemedText } from "@/components/ThemedText";
import { FC, useState } from "react";
import { format } from "date-fns";
import {
  ItemContainer,
  SelectableContainer,
  AltTextContainer,
} from "./CollectionItemContainer.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  View,
  Linking,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";

interface CollectionItemContainerProps {
  type?: string | number;
  multiselectArray?: string[];
  date?: Date | null;
  title?: string;
  subtitle?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  link?: string;
  linkPreview?: string;
  imageUri?: string;
  altText?: string;
}
const CollectionItemContainer: FC<CollectionItemContainerProps> = ({
  type,
  multiselectArray,
  date,
  title,
  subtitle,
  icon,
  iconColor,
  link,
  linkPreview,
  imageUri,
  altText,
}) => {
  const getValidUrl = (url: string): string => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return "https://" + url;
    }
    return url;
  };
  const themeMode = useActiveColorScheme() ?? "light";
  const colorScheme = useActiveColorScheme();
  const greyColor = colorScheme === "dark" ? Colors.grey50 : Colors.grey100;
  const screenWidth = Dimensions.get("window").width;

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

  const getAccessibilityLabel = () => {
    const parts: string[] = [];

    if (subtitle) {
      parts.push(`Label ${subtitle}`);
    }

    if (title) {
      parts.push(`${title}`);
    }

    if (type && typeof type === "string") {
      let ratingNumber: number | null = null;
      if (type.startsWith("0/5")) ratingNumber = 0;
      if (type.startsWith("1/5")) ratingNumber = 1;
      if (type.startsWith("2/5")) ratingNumber = 2;
      if (type.startsWith("3/5")) ratingNumber = 3;
      if (type.startsWith("4/5")) ratingNumber = 4;
      if (type.startsWith("5/5")) ratingNumber = 5;
      if (ratingNumber) {
        parts.push(`Rating: ${ratingNumber} out of 5 ${icon} icons`);
      } else {
        parts.push(`Text: ${type}`);
      }
    } else if (type) {
      parts.push(`Type: ${type}`);
    }

    if (date) {
      parts.push(`Date: ${format(date, "dd.MM.yyyy")}`);
    }

    if (multiselectArray && multiselectArray.length > 0) {
      parts.push(`Selectables: ${multiselectArray.join(", ")}`);
    }

    if (imageUri) {
      parts.push(
        `Image Description: ${altText ? altText : "no image description was provided"}`,
      );
    }

    if (link) {
      parts.push(`Link Text: ${linkPreview || link}`);
    }

    return parts.join(". ");
  };

  return (
    <ItemContainer
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel={getAccessibilityLabel()}
    >
      <ThemedText
        fontWeight="regular"
        fontSize="s"
        style={{ color: greyColor }}
        accessible={false}
      >
        {subtitle}
      </ThemedText>

      {imageUri && (
        <View
          style={{
            height: 400,
            width: screenWidth - 40,
            borderRadius: 16,
            backgroundColor: "#EAEAEA",
            marginTop: 8,
            overflow: "hidden",
            gap: 8,
          }}
          accessibilityLabel={altText}
          accessibilityRole="image"
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: themeMode === "dark" ? "#3d3d3d" : "#EAEAEA",
            }}
          />
          <Image
            source={{ uri: imageUri }}
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "contain",
            }}
            accessible={false}
          />
          {altText && (
            <AltTextContainer themeMode={themeMode}>
              <ThemedText fontWeight="regular" fontSize="s" accessible={false}>
                {altText}
              </ThemedText>
            </AltTextContainer>
          )}
        </View>
      )}

      {title && (
        <View style={{ marginTop: -8 }}>
          <ThemedText fontWeight="semibold" fontSize="l">
            {title}
          </ThemedText>
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: colorScheme === "dark" ? "#3d3d3d" : "#EAEAEA",
              marginTop: 8,
            }}
          />
        </View>
      )}

      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {icon && (
          <MaterialIcons
            name={icon}
            size={24}
            color={colorScheme === "light" ? "#176BBA" : "#4599E8"}
          />
        )}
        {type && (
          <ThemedText fontWeight="regular" fontSize="regular">
            {type}
          </ThemedText>
        )}
        {date && (
          <ThemedText fontWeight="regular" fontSize="regular">
            {date ? format(date, "dd.MM.yyyy") : "dd.mm.yyyy"}
          </ThemedText>
        )}
      </View>

      {multiselectArray && (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 6,
            marginTop: -5,
          }}
        >
          {multiselectArray.map((multiselectArray, index) => (
            <SelectableContainer
              key={`${multiselectArray}-${index}`}
              themeMode={themeMode}
              style={{ border: `1px solid ${greyColor}` }}
            >
              <ThemedText fontWeight="regular" fontSize="s">
                {multiselectArray}
              </ThemedText>
            </SelectableContainer>
          ))}
        </View>
      )}

      {link && (
        <TouchableOpacity
          onPress={handlePressLink}
          accessible={true}
          accessibilityRole="link"
          accessibilityLabel={linkPreview || link}
          accessibilityHint="Activate to open the link"
        >
          <ThemedText
            fontWeight="semibold"
            fontSize="regular"
            style={{
              color: colorScheme === "light" ? "#176BBA" : "#4599E8",
              textDecorationLine: "underline",
              marginTop: -8,
              minHeight: 48,
              textAlignVertical: "center",
            }}
          >
            {linkPreview || link}
          </ThemedText>
        </TouchableOpacity>
      )}
    </ItemContainer>
  );
};

export default CollectionItemContainer;
