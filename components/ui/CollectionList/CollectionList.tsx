import React, { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  CollectionListContainer,
  CollectionListEditIcon,
  CollectionListScrolls,
  CollectionListTab,
  CollectionListText,
} from "./CollectionList.style";
import { View, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";

/**
 * Component for displaying a list of collection names. (in CollectionScreen)
 * It allows users to select a collection and navigate to edit it if needed.
 * @param collectionLists (required) - Array of collection names to display.
 * @param onSelect - Optional callback function to handle selection of a collection.
 * @param isArchived - Optional boolean to indicate if the collections are archived.
 * @param goToEdit (required) - Function to navigate to the edit screen for collection lists.
 */

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
  isArchived = false,
  goToEdit,
}) => {
  const [activeList, setActiveList] = useState<string | null>(null);
  const colorScheme = useActiveColorScheme() ?? "light";
  const shouldShowEditIcon = collectionLists.length <= 9 && !isArchived;

  /**
   * Effect to set the first collection as active when the component mounts.
   */
  useEffect(() => {
    if (collectionLists.length > 0) {
      setActiveList(collectionLists[0]);
      onSelect?.(collectionLists[0]);
    }
  }, [collectionLists]);

  /**
   * Function to handle the selection of a collection list.
   * It updates the active list and calls the onSelect callback if provided.
   * @param collectionList - The name of the collection list to select.
   */
  const handlePress = (collectionList: string) => {
    if (collectionList === activeList) return;
    setActiveList(collectionList);
    onSelect?.(collectionList);
  };

  return (
    <View style={{ marginLeft: 20, marginRight: 20 }}>
      {/* Display a horizontal scroll view for the collection lists */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 50 }}
      >
        <CollectionListScrolls>
          {collectionLists.map((collectionList, index) => {
            const isActive = collectionList === activeList;

            return (
              <CollectionListContainer
                key={`${collectionList}-${index}`}
                active={isActive}
                themeMode={colorScheme}
                onPress={() => {
                  if (!isActive) handlePress(collectionList);
                }}
                activeOpacity={isActive ? 1 : 0.7}
              >
                <CollectionListTab>
                  {isActive && (
                    <MaterialIcons
                      name="bookmark-added"
                      size={16}
                      color={
                        colorScheme === "light"
                          ? Colors.primary
                          : Colors.secondary
                      }
                      style={{ marginRight: 10, marginTop: -6 }}
                    />
                  )}
                  <CollectionListText active={isActive} themeMode={colorScheme}>
                    {collectionList}
                  </CollectionListText>
                </CollectionListTab>
              </CollectionListContainer>
            );
          })}

          {shouldShowEditIcon && (
            <TouchableOpacity
              onPress={goToEdit}
              style={{
                justifyContent: "center",
              }}
            >
              <CollectionListEditIcon>
                <MaterialIcons name="edit" size={24} color={Colors.white} />
              </CollectionListEditIcon>
            </TouchableOpacity>
          )}
        </CollectionListScrolls>
      </ScrollView>
    </View>
  );
};

export default CollectionList;
