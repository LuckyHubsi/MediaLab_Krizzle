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
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={{ maxHeight: 42 }}
    >
      <View style={{ flexDirection: "row", flexWrap: "nowrap" }}>
        {collectionLists.map((collectionList) => (
          <CollectionListContainer
            key={collectionList}
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
                  name="check-circle-outline"
                  size={16}
                  color="#FFFFFF"
                  style={{ marginRight: 6 }}
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
  );
};

export default CollectionList;
