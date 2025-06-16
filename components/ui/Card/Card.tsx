import React, { FC, PropsWithChildren, useState } from "react";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { LayoutChangeEvent, ScrollView, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StyledCard } from "./Card.styles";

interface CardProps {
  width?: string;
  height?: string;
  maxHeight?: number;
  scrollable?: boolean;
}

export const Card: FC<PropsWithChildren<CardProps>> = ({
  children,
  width = "100%",
  height = "auto",
  maxHeight = 200,
  scrollable = false,
}) => {
  const colorScheme = useActiveColorScheme() ?? "light";
  const [contentHeight, setContentHeight] = useState(0);

  // decide if scrolling is needed
  const shouldScroll = scrollable && contentHeight + 20 > maxHeight;

  // wrapper to measure content height
  const onContentLayout = (e: LayoutChangeEvent) => {
    setContentHeight(e.nativeEvent.layout.height);
  };

  return (
    <StyledCard
      colorScheme={colorScheme}
      width={width}
      height={height}
      maxHeight={shouldScroll ? maxHeight : undefined}
    >
      {shouldScroll ? (
        <ScrollView
          style={{ maxHeight }}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator
        >
          <View style={{ padding: 20 }}>{children}</View>
        </ScrollView>
      ) : (
        // Invisible wrapper to measure children height
        <View style={{ padding: 20 }} onLayout={onContentLayout}>
          {children}
        </View>
      )}

      {shouldScroll && (
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 130,
            borderRadius: 33,
          }}
          pointerEvents="none"
          accessible={false}
        />
      )}
    </StyledCard>
  );
};

export default Card;
