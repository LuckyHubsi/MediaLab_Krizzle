import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  CollectionCardContainer,
  CollectionText,
  CollectionRating,
  CollectionTitle,
  CollectionSelectable,
} from "./CollectionWidget.style";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View } from "react-native";

type CollectionProps = {
  collectionTitleValue: string;
  collectionTextValue: string;
  collectionList: string;
  collectionDateValue: string;
  collectionRating: string;
  collectionSelectable?: string[];
  onPress?: () => void;
};
const isTextVisible = false; // This is a placeholder for the actual logic to determine visibility

const CollectionWidget: React.FC<CollectionProps> = ({
  collectionTitleValue,
  collectionTextValue,
  collectionList,
  collectionDateValue,
  collectionRating,
  collectionSelectable,

  onPress,
}) => {
  const colorScheme = useColorScheme() ?? "light";
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <CollectionCardContainer colorScheme={colorScheme}>
        {/* //Title */}
        <CollectionTitle colorScheme={colorScheme}>
          {collectionTitleValue}
        </CollectionTitle>
        {/* //Text */}
        <CollectionText colorScheme={colorScheme}>
          {collectionTextValue}
        </CollectionText>
        {/* //IF you want to hide preview: */}
        {collectionTextValue && (
          <CollectionText
            colorScheme={colorScheme}
            style={{ display: isTextVisible ? "flex" : "none" }}
          >
            {collectionTextValue}
          </CollectionText>
        )}
        {/* //Date and Rating Container */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* //Date */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons
              name="calendar-today"
              size={24}
              color={colorScheme === "light" ? "#585858" : "#ABABAB"}
              style={{ marginRight: 6 }}
            />
            <CollectionRating colorScheme={colorScheme}>
              {collectionDateValue}
            </CollectionRating>
          </View>
          {/* //Rating Container */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons
              name="star"
              size={24}
              color="#E7C716"
              style={{ marginRight: 6 }}
            />
            <CollectionRating colorScheme={colorScheme}>
              {collectionRating + "/5"}
            </CollectionRating>
          </View>
        </View>
        {/* //Selectables */}
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {collectionSelectable?.map((item, index) => (
            <CollectionSelectable colorScheme={colorScheme} key={index}>
              <Text>{item}</Text>
            </CollectionSelectable>
          ))}
        </View>
      </CollectionCardContainer>
    </TouchableOpacity>
  );
};

export default CollectionWidget;
