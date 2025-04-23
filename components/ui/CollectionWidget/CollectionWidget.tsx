import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import {
  CollectionCardContainer,
  CollectionText,
  CollectionRating,
  CollectionTitle,
  CollectionSelectable,
} from "./CollectionWidget.style";
import { Collection } from "@/models/CollectionModel";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View } from "react-native";

type CollectionProps = {
  collectionTitle: string;
  collectionText: string;
  collectionList: string;
  collectionDate: string;
  collectionRating: string;
  collectionSelectable?: string[];
  onPress?: () => void;
};
const isTextVisible = false; // This is a placeholder for the actual logic to determine visibility

const CollectionWidget: React.FC<CollectionProps> = ({
  collectionTitle,
  collectionText,
  collectionList,
  collectionDate,
  collectionRating,
  collectionSelectable,

  onPress,
}) => {
  const colorScheme = useColorScheme() ?? "light";
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <CollectionCardContainer colorScheme={colorScheme}>
        //Title
        <CollectionTitle colorScheme={colorScheme}>
          {collectionTitle}
        </CollectionTitle>
        //Text
        <CollectionText colorScheme={colorScheme}>
          {collectionText}
        </CollectionText>
        //IF you want to hide preview:
        {collectionText && (
          <CollectionText
            colorScheme={colorScheme}
            style={{ display: isTextVisible ? "flex" : "none" }}
          >
            {collectionText}
          </CollectionText>
        )}
        //Date and Rating Container
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          //Date
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons
              name="calendar-today"
              size={24}
              color={colorScheme === "light" ? "#585858" : "#ABABAB"}
              style={{ marginRight: 6 }}
            />
            <CollectionRating colorScheme={colorScheme}>
              {collectionDate}
            </CollectionRating>
          </View>
          //Rating Container
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
        //Selectables
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
