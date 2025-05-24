import { ThemedText } from "@/components/ThemedText";
import { FC, useState } from "react";
import { format } from "date-fns";
import {
  ContentText,
  ItemContainer,
  SelectableContainer,
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
  const safeAreaWidth = Dimensions.get("screen").width;

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
          />
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
          <MaterialIcons name={icon} size={24} color={iconColor || "#585858"} />
        )}
        {type && (
          <ThemedText
            fontWeight="semibold"
            fontSize="s"
            style={{ color: greyColor }}
          >
            {type}
          </ThemedText>
        )}
        {date && (
          <ThemedText
            fontWeight="semibold"
            fontSize="s"
            style={{ color: greyColor }}
          >
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
              <ThemedText
                fontWeight="regular"
                fontSize="s"
                style={{ color: greyColor }}
              >
                {multiselectArray}
              </ThemedText>
            </SelectableContainer>
          ))}
        </View>
      )}

      {link && (
        <TouchableOpacity onPress={handlePressLink}>
          <ContentText
            style={{
              color: "#2980ff",
              textDecorationLine: "underline",
              marginTop: -10,
            }}
          >
            {linkPreview || link}
          </ContentText>
        </TouchableOpacity>
      )}
    </ItemContainer>
  );
};

export default CollectionItemContainer;
