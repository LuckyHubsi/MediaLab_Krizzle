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
    <View>
      <GradientBackgroundWrapper
        colors={["#4599E8", "transparent"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 400,
          bottom: 0,
          zIndex: 1, // Set zIndex lower than other elements
        }}
        pointerEvents="none"
      />{" "}
      <GradientBackgroundWrapper
        colors={["transparent", "#583FE7"]}
        style={{
          position: "absolute",
          top: 0,
          left: 400,
          right: 0,
          bottom: 0,
          zIndex: 1, // Set zIndex lower than other elements
        }}
        pointerEvents="none"
      />
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 42, paddingLeft: 20, paddingRight: 20 }}
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
