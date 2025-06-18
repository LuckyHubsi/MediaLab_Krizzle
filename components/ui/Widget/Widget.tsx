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
  Tag,
  CardSolid,
  CardGradient,
  PreviewWrapper,
} from "./Widget.style";
import { ThemedText } from "@/components/ThemedText";
import { PageType } from "@/shared/enum/PageType";

type ColorKey = keyof typeof Colors.widget;

/**
 * Component for displaying a title input card in the create/edit widget flow.
 *
 * @param title (required) - The title of the widget.
 * @param label (required) - The label or tag associated with the widget.
 * @param icon - Optional icon to display in the widget.
 * @param color (required) - The color key for the widget background.
 * @param pageType - Optional type of page (e.g., collection or note).
 * @param onPress - Callback function to handle press events.
 * @param onLongPress - Callback function to handle long press events.
 * @param isPreview - Whether the widget is in preview mode, which adds a "Preview" label.
 */

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
  const previewScale = isPreview ? 0.8 : 1; // scale down preview widgets
  const cardWidth = ((width - spacing) / columns) * previewScale;
  const background = Colors.widget[color];
  const isGradient = Array.isArray(background);
  const CardWrapper = isGradient ? CardGradient : CardSolid;
  const cardPadding = isPreview ? 15 : 20;
  const cardProps = isGradient
    ? {
        colors: background,
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        cardWidth,
        padding: cardPadding, // add this
      }
    : {
        backgroundColor: background,
        cardWidth,
        padding: cardPadding, // add this
      };

  /**
   * Handles long press events on the widget.
   */
  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress();
    } else {
      console.log("Long press detected on widget:", title);
    }
  };

  const iconName =
    React.isValidElement(icon) && icon.props?.name
      ? icon.props.name
      : "unknown icon";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      onLongPress={handleLongPress}
      accessibilityRole="button"
      accessibilityLabel={`Open ${pageType} titled ${title} with ${label != "uncategorized" ? "tag " + label : "no tag"}, ${iconName != "unknown icon" ? iconName + " icon" : "no icon selected"} and color ${color} selected`}
      accessibilityHint="Activate to open to open. Long press for more options."
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
              style={{ position: "absolute", top: 15, left: 15, zIndex: 1 }}
            >
              Preview
            </ThemedText>
          </PreviewWrapper>
        )}
        {/* Icon Container */}
        {icon && <IconsContainer>{icon && <Icon>{icon}</Icon>}</IconsContainer>}

        {/* Page Type */}
        {pageType && !isPreview && (
          <ThemedText fontSize="s" fontWeight="light" colorVariant="white">
            {pageType === PageType.Collection ? "collection" : "note"}
          </ThemedText>
        )}

        {/* Widget Title */}
        <ThemedText
          fontSize="regular"
          fontWeight="bold"
          colorVariant="white"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {title}
        </ThemedText>

        {/* Tag */}
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
