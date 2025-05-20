import React, { useState } from "react";
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
import { GradientBackgroundWrapper } from "../GradientBackground/GradientBackground.styles";
import { ThemedView } from "../ThemedView/ThemedView";

type CollectionListProps = {
  collectionLists: string[];
  onSelect?: (selected: string | null) => void;
};

const CollectionList: React.FC<CollectionListProps> = ({
  collectionLists,
  onSelect,
}) => {
  const [activeList, setActiveList] = useState<string | null>(
    collectionLists[0],
  );
  const themeMode = useActiveColorScheme() ?? "light";
  const handlePress = (collectionList: string) => {
    if (collectionList === activeList) {
      // If the active list is clicked again, unselect it
      setActiveList(null);
      onSelect?.(null); // Pass null to indicate no selection
    } else {
      // Otherwise, set it as the active list
      setActiveList(collectionList);
      onSelect?.(collectionList);
    }
  };
  return (
    <View style={{ marginLeft: 20, marginRight: 20 }}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 42 }}
      >
        <View style={{ flexDirection: "row", flexWrap: "nowrap" }}>
          {collectionLists.map((collectionList, index) => (
            <CollectionListContainer
              key={`${collectionList}-${index}`}
              active={collectionList === activeList}
              themeMode={themeMode}
              onPress={() => handlePress(collectionList)}
            >
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  alignContent: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {collectionList === activeList && (
                  <MaterialIcons
                    name="bookmark-added"
                    size={16}
                    color="#4599E8"
                    style={{ marginRight: 10 }}
                  />
                )}
                <CollectionListText
                  active={collectionList === activeList}
                  themeMode={themeMode}
                >
                  {collectionList}
                </CollectionListText>
              </View>
            </CollectionListContainer>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default CollectionList;
