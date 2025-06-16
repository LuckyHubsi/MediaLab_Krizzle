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
  const getValidUrl = (url: string): string => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return "https://" + url;
    }
    return url;
  };
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
  return (
    <ItemContainer>
      <ThemedText
        fontWeight="regular"
        fontSize="s"
        style={{ color: greyColor }}
      >
        {subtitle}
      </ThemedText>

      {imageUri && (
        <ImageContainer
          style={{
            width: screenWidth - 40,
          }}
        >
          <ImageOverlay colorScheme={colorScheme} />
          <Image
            source={{ uri: imageUri }}
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "contain",
            }}
            accessible={true}
            accessibilityLabel={altText}
          />
          {altText && (
            <AltTextContainer colorScheme={colorScheme}>
              <ThemedText fontWeight="regular" fontSize="s">
                {altText}
              </ThemedText>
            </AltTextContainer>
          )}
        </ImageContainer>
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
              backgroundColor:
                colorScheme === "dark"
                  ? Colors.dark.pillBackground
                  : Colors.grey25,
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

      {link && (
        <TouchableOpacity onPress={handlePressLink} style={{ minHeight: 48 }}>
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
