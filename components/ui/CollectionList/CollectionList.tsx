import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  CollectionListContainer,
  CollectionListText,
} from "./CollectionList.style";
import { View } from "react-native";
import { ScrollView } from "react-native";
import { useActiveColorScheme } from "@/context/ThemeContext";

type CollectionListProps = {
  collectionLists?: string[];
  onPress?: () => void;
};

const CollectionList: React.FC<CollectionListProps> = ({
  collectionLists,
  onPress,
}) => {
  const colorScheme = useActiveColorScheme() ?? "light";
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={{ maxHeight: 42 }}
    >
      <View style={{ flexDirection: "row", flexWrap: "nowrap" }}>
        {collectionLists?.map((item, index) => (
          <TouchableOpacity activeOpacity={0.85} onPress={onPress} key={index}>
            <CollectionListContainer colorScheme={colorScheme} key={index}>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialIcons
                  name="check-circle-outline"
                  size={16}
                  color="#FFFFFF"
                  style={{ marginRight: 6 }}
                />
                <CollectionListText>
                  <Text>{item}</Text>
                </CollectionListText>
              </View>
            </CollectionListContainer>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default CollectionList;
