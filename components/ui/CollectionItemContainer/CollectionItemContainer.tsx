import { ThemedText } from "@/components/ThemedText";
import { FC, useState } from "react";
import { ItemContainer } from "./CollectionItemContainer.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View } from "react-native";

interface CollectionItemContainerProps {
  type?: string;
  title?: string;
  subtitle?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  text?: string;
}
const CollectionItemContainer: FC<CollectionItemContainerProps> = ({
  type,
  title,
  subtitle,
  icon,
  text,
}) => {
  return (
    <ItemContainer>
      <ThemedText fontWeight="regular" fontSize="s">
        {subtitle}
      </ThemedText>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        {icon && <MaterialIcons name={icon} size={24} color="#585858" />}
        {type && (
          <ThemedText fontWeight="regular" fontSize="s">
            {type}
          </ThemedText>
        )}
        {text && (
          <ThemedText fontWeight="regular" fontSize="s">
            {text}
          </ThemedText>
        )}
      </View>

      {title && (
        <View>
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
    </ItemContainer>
  );
};

export default CollectionItemContainer;
