import React, { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import CollectionList from "../CollectionList/CollectionList";
import { BackgroundCard } from "./CollectionListCard.styles";
import { SafeAreaView, View, ViewProps } from "react-native";
import { StyledView } from "../GradientBackground/GradientBackground.styles";

export type CollectionListCardPorps = ViewProps & {
  collectionLists: string[];
  onSelect?: (selected: string | null) => void;
  listNames?: string[];
  setSelectedList?: (selectedList: string) => void;
  lightColor?: string;
  darkColor?: string;
  topPadding?: number;
  backgroundCardTopOffset?: number;
};

export const CollectionListCard: React.FC<CollectionListCardPorps> = ({
  collectionLists,
  onSelect,
  listNames = [],
  setSelectedList,
  lightColor,
  darkColor,
  topPadding = 30,
  style,
  children,
  backgroundCardTopOffset,
  ...otherProps
}) => {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background",
  );
  return (
    <View style={{ flex: 1 }}>
      <CollectionList
        collectionLists={listNames}
        onSelect={(collectionList) => {
          if (setSelectedList) {
            setSelectedList(collectionList || "All"); // Safely call setSelectedList
          }
        }}
      />
      <BackgroundCard
        backgroundColor={backgroundColor}
        topOffset={backgroundCardTopOffset}
      />

      {/* Foreground content */}
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        <StyledView topPadding={topPadding} style={style} {...otherProps}>
          {children}
        </StyledView>
      </SafeAreaView>
    </View>
  );
};
