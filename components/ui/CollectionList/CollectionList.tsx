import React, { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  CollectionListContainer,
  CollectionListText,
} from "./CollectionList.style";
import { View, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

type CollectionListProps = {
  collectionLists: string[];
  onSelect?: (selected: string) => void;
  collectionId?: string;
  isArchived?: boolean;
  goToEdit: () => void;
};

const CollectionList: React.FC<CollectionListProps> = ({
  collectionLists,
  onSelect,
  collectionId,
  isArchived = false,
  goToEdit,
}) => {
  const [activeList, setActiveList] = useState<string | null>(null);
  const themeMode = useActiveColorScheme() ?? "light";
  const router = useRouter();

  useEffect(() => {
    if (collectionLists.length > 0) {
      setActiveList(collectionLists[0]);
      onSelect?.(collectionLists[0]);
    }
  }, [collectionLists]);

  const handlePress = (collectionList: string) => {
    if (collectionList === activeList) return;
    setActiveList(collectionList);
    onSelect?.(collectionList);
  };

  const shouldShowEditIcon = collectionLists.length <= 9 && !isArchived;

  return (
    <View style={{ marginLeft: 20, marginRight: 20 }}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 42 }}
      >
        <View style={{ flexDirection: "row", flexWrap: "nowrap" }}>
          {collectionLists.map((collectionList, index) => {
            const isActive = collectionList === activeList;

            return (
              <CollectionListContainer
                key={`${collectionList}-${index}`}
                active={isActive}
                themeMode={themeMode}
                onPress={() => {
                  if (!isActive) handlePress(collectionList);
                }}
                activeOpacity={isActive ? 1 : 0.7}
                accessible={true}
                accessibilityLabel={`Collection list ${collectionList}`}
                accessibilityState={{ selected: isActive }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {isActive && (
                    <MaterialIcons
                      name="bookmark-added"
                      size={16}
                      color={
                        themeMode === "light"
                          ? Colors.primary
                          : Colors.secondary
                      }
                      style={{ marginRight: 10 }}
                    />
                  )}
                  <CollectionListText active={isActive} themeMode={themeMode}>
                    {collectionList}
                  </CollectionListText>
                </View>
              </CollectionListContainer>
            );
          })}

          {shouldShowEditIcon && (
            <TouchableOpacity
              onPress={goToEdit}
              style={{ marginLeft: 8, justifyContent: "center" }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="`Edit Collection lists"
              accessibilityHint="Opens the Edit Collection Lists Page"
            >
              <MaterialIcons
                name="edit"
                size={24}
                color={themeMode === "dark" ? "white" : "white"}
              />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default CollectionList;
