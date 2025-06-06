import React from "react";
import {
  TouchableOpacity,
  useWindowDimensions,
  View,
  StyleSheet,
} from "react-native";
import { Colors } from "@/constants/Colors";
import {
  IconsContainer,
  Icon,
  Title,
  Tag,
  CardSolid,
  CardGradient,
  PreviewWrapper,
} from "./Widget.style";
import { ThemedText } from "@/components/ThemedText";
import { PageType } from "@/shared/enum/PageType";

type ColorKey = keyof typeof Colors.widget;

type Props = {
  title: string;
  label: string;
  icon?: React.ReactNode;
  color: ColorKey;
  pageType?: PageType;
  onPress?: () => void;
  onLongPress?: () => void;
  isPreview?: boolean;
};

const Widget: React.FC<Props> = ({
  title,
  label,
  icon,
  color,
  pageType,
  onPress,
  onLongPress,
  isPreview,
}) => {
  const { width } = useWindowDimensions();
  const columns = width >= 768 ? 3 : 2;
  const spacing = 19 * (columns + 1);
  const cardWidth = (width - spacing) / columns;
  // const truncatedTitle = title.length > 15 ? `${title.slice(0, 15)}...` : title;

  const background = Colors.widget[color];
  const isGradient = Array.isArray(background);

  const CardWrapper = isGradient ? CardGradient : CardSolid;

  const cardProps = isGradient
    ? {
        colors: background,
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        cardWidth,
      }
    : { backgroundColor: background, cardWidth };

  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress();
    } else {
      console.log("Long press detected on widget:", title);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      onLongPress={handleLongPress}
    >
      <CardWrapper {...cardProps}>
        {isGradient && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(0, 0, 0, 0.15)",
              borderRadius: 33,
            }}
            pointerEvents="none"
          />
        )}

        {isPreview && (
          <PreviewWrapper>
            <ThemedText
              fontSize="s"
              fontWeight="light"
              colorVariant="white"
              style={{ position: "absolute", top: 20, left: 20, zIndex: 1 }}
            >
              Preview
            </ThemedText>
          </PreviewWrapper>
        )}
        {icon && <IconsContainer>{icon && <Icon>{icon}</Icon>}</IconsContainer>}
        {pageType && (
          <ThemedText fontSize="s" fontWeight="light" colorVariant="white">
            {pageType === PageType.Collection ? "collection" : "note"}
          </ThemedText>
        )}

        <ThemedText
          fontSize="regular"
          fontWeight="bold"
          colorVariant="white"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </ThemedText>

        {/* Tag below */}
        {label &&
          label.trim() !== "" &&
          label.trim().toLowerCase() !== "uncategorized" && (
            <Tag numberOfLines={1} ellipsizeMode="tail">
              {label}
            </Tag>
          )}
      </CardWrapper>
    </TouchableOpacity>
  );
};

export default Widget;
