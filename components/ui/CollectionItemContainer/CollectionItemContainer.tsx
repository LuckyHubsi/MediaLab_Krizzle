import { ThemedText } from "@/components/ThemedText";
import { FC, useState } from "react";
import { format } from "date-fns";
import {
  ContentText,
  ItemContainer,
  SelectableContainer,
  SelectableText,
  SubtitleText,
} from "./CollectionItemContainer.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View, Linking, TouchableOpacity, Image } from "react-native";

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
  return (
    <ItemContainer>
      <SubtitleText>{subtitle}</SubtitleText>
      {imageUri && (
        <View
          style={{
            height: 400,
            width: "100%",
            borderRadius: 16,
            backgroundColor: "#EAEAEA",
            marginTop: 8,
            overflow: "hidden",
          }}
        >
          <Image
            source={{ uri: imageUri }}
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "cover",
            }}
          />
        </View>
      )}
      {title && (
        <View style={{ marginTop: -4 }}>
          <ThemedText fontWeight="semibold" fontSize="l">
            {title}
          </ThemedText>
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#EAEAEA",
              marginTop: 8,
            }}
          />
        </View>
      )}

      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {icon && (
          <MaterialIcons name={icon} size={24} color={iconColor || "#585858"} />
        )}
        {type && <ContentText>{type}</ContentText>}
        {date && (
          <ContentText>
            {date ? format(date, "dd.MM.yyyy") : "dd.mm.yyyy"}
          </ContentText>
        )}
      </View>

      {multiselectArray && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
          {multiselectArray.map((multiselectArray, index) => (
            <SelectableContainer key={`${multiselectArray}-${index}`}>
              <SelectableText>{multiselectArray}</SelectableText>
            </SelectableContainer>
          ))}
        </View>
      )}

      {link && (
        <TouchableOpacity onPress={() => Linking.openURL(link)}>
          <ContentText
            style={{ color: "#2980ff", textDecorationLine: "underline" }}
          >
            {linkPreview || link}
          </ContentText>
        </TouchableOpacity>
      )}
    </ItemContainer>
  );
};

export default CollectionItemContainer;
