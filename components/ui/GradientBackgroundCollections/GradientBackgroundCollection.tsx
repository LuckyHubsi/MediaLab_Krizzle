import { View, ViewProps } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  BackgroundCard,
  GradientBackgroundWrapper,
  StyledView,
} from "./GradientBackgroundCollection.styles";
import { SafeAreaView } from "react-native-safe-area-context";
import CollectionList from "@/components/ui/CollectionList/CollectionList";
import { ThemedView } from "../ThemedView/ThemedView";
import { CustomStyledHeader } from "../CustomStyledHeader/CustomStyledHeader";
import { CollectionListCard } from "../CollectionListCard/CollectionListCard";

export type GradientBackgroundProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  topPadding?: number;
  backgroundCardTopOffset?: number;
  collectionLists: string[];
  onSelect?: (selected: string | null) => void;
  listNames?: string[];
  setSelectedList?: (selectedList: string) => void;
  filteredItems?: any[];
  items?: any;
  setSelectedItem?: (selectedItem: any) => void;
  setShowItemModal?: (showItemModal: boolean) => void;
  searchQuery?: string;
};

export function GradientBackgroundCollection({
  lightColor,
  darkColor,
  topPadding = 30,
  style,
  children,
  backgroundCardTopOffset,
  collectionLists,
  onSelect,
  listNames = [],
  setSelectedList,
  filteredItems = [],
  items,
  setSelectedItem,
  setShowItemModal,
  searchQuery,

  ...otherProps
}: GradientBackgroundProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Background layers */}
      <GradientBackgroundWrapper
        colors={["#4599E8", "#583FE7"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1, // Set zIndex lower than other elements
        }}
      ></GradientBackgroundWrapper>

      <SafeAreaView style={{ flex: 0.26, backgroundColor: "transparent" }}>
        <StyledView topPadding={topPadding} style={style} {...otherProps}>
          {children}
        </StyledView>
      </SafeAreaView>
      <CollectionListCard
        collectionLists={listNames}
        listNames={listNames}
        setSelectedList={setSelectedList}
        onSelect={(collectionList) => {
          if (setSelectedList) {
            setSelectedList(collectionList || "All"); // Safely call setSelectedList
          }
        }}
        filteredItems={filteredItems}
        items={items}
        setSelectedItem={setSelectedItem}
        setShowItemModal={setShowItemModal}
        searchQuery={searchQuery}
      />
    </View>
  );
}
