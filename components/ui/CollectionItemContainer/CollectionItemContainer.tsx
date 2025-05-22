import { ThemedText } from "@/components/ThemedText";
import { FC, useState } from "react";
import {
  ItemContainer,
  SelectableContainer,
  SelectableText,
  SubtitleText,
} from "./CollectionItemContainer.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View } from "react-native";

interface CollectionItemContainerProps {
  type?: string;
  multiselectArray?: string[];
  contentText?: string;
  title?: string;
  subtitle?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
}
const CollectionItemContainer: FC<CollectionItemContainerProps> = ({
  type,
  multiselectArray,
  title,
  subtitle,
  icon,
}) => {
  return (
    <ItemContainer>
      <SubtitleText>{subtitle}</SubtitleText>
      {title && (
        <View style={{ marginTop: -10 }}>
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
        {icon && <MaterialIcons name={icon} size={24} color="#585858" />}
        {type && (
          <ThemedText fontWeight="regular" fontSize="s">
            {type}
          </ThemedText>
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
    </ItemContainer>
  );
};

export default CollectionItemContainer;
