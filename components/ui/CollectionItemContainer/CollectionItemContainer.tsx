import { ThemedText } from "@/components/ThemedText";
import { FC } from "react";
import { format } from "date-fns";
import {
  ItemContainer,
  SelectableContainer,
  AltTextContainer,
  ImageContainer,
  ImageOverlay,
} from "./CollectionItemContainer.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  View,
  Linking,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";

/**
 * Component for displaying a collection item with various properties such as:
 * - multiselect, date, title, text, icon, link (with optional title), and image (with alt text).
 * @param type - Optional type of the item (string or number).
 * @param multiselectArray - Optional array of strings for multiselect options.
 * @param date - Optional date for the item.
 * @param title - Optional title for the item.
 * @param subtitle - Optional subtitle for the item.
 * @param icon - Optional icon name from MaterialIcons.
 * @param iconColor - Optional color for the icon.
 * @param link - Optional link for the item.
 * @param linkPreview - Optional preview text for the link.
 * @param imageUri - Optional URI for an image to display.
 * @param altText - Optional alt text for the image.
 */

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
  link,
  linkPreview,
  imageUri,
  altText,
}) => {
  const colorScheme = useActiveColorScheme();
  const greyColor = colorScheme === "dark" ? Colors.grey50 : Colors.grey100;
  const screenWidth = Dimensions.get("window").width;

  /**
   * Function to ensure the URL is valid by adding "https://"
   * (if it doesn't already start with "http://" or "https://")
   * Returns the valid URL.
   */
  const getValidUrl = (url: string): string => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return "https://" + url;
    }
    return url;
  };

  /**
   * Function to handle the link press event.
   * It checks if the link is valid and supported, then opens it.
   * If the link cannot be opened, it shows an alert.
   */
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
      parts.push(`${altText ? "Image Description: " + altText : ""}}`);
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

      {/* Display the image if imageUri is provided */}
      {imageUri && (
        <ImageContainer
          style={{
            width: screenWidth - 40,
          }}
          accessibilityLabel={altText}
          accessibilityRole="image"
        >
          <ImageOverlay colorScheme={colorScheme} />
          <Image
            source={{ uri: imageUri }}
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "contain",
            }}
            accessible={false}
          />
          {/* Display alt text if provided */}
          {altText && (
            <AltTextContainer colorScheme={colorScheme}>
              <ThemedText fontWeight="regular" fontSize="s">
                {altText}
              </ThemedText>
            </AltTextContainer>
          )}
        </ImageContainer>
      )}

      {/* Display the title if provided */}
      {title && (
        <View style={{ marginTop: -8 }}>
          <ThemedText fontWeight="semibold" fontSize="l">
            {title}
          </ThemedText>
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor:
                colorScheme === "dark"
                  ? Colors.dark.pillBackground
                  : Colors.grey25,
              marginTop: 8,
            }}
          />
        </View>
      )}

      {/* Display the icon, type, and date if provided */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {icon && (
          <MaterialIcons
            name={icon}
            size={24}
            color={colorScheme === "light" ? Colors.primary : Colors.secondary}
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

      {/* Display the multiselect array if provided */}
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
              colorScheme={colorScheme}
              style={{ border: `1px solid ${greyColor}` }}
            >
              <ThemedText fontWeight="regular" fontSize="s">
                {multiselectArray}
              </ThemedText>
            </SelectableContainer>
          ))}
        </View>
      )}

      {/* Display the link if provided */}
      {link && (
        <TouchableOpacity
          onPress={handlePressLink}
          style={{ minHeight: 48 }}
          accessible={true}
          accessibilityRole="link"
          accessibilityLabel={linkPreview || link}
          accessibilityHint="Activate to open the link"
        >
          <ThemedText
            fontWeight="semibold"
            fontSize="regular"
            style={{
              color:
                colorScheme === "light" ? Colors.primary : Colors.secondary,
              textDecorationLine: "underline",
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
