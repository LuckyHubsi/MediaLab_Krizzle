import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "./WidgetPreview.style";

interface WidgetPreviewProps {
  icon1: keyof typeof MaterialIcons.glyphMap;
  icon2: keyof typeof MaterialIcons.glyphMap;
  tag: string;
  title: string;
  backgroundColor?: string;
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({
  icon1,
  icon2,
  tag,
  title,
  backgroundColor,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.previewLabel}>Widget Preview</Text>

      <View style={[styles.widgetContainer, { backgroundColor }]}>
        {/* Top-right Icons */}
        <View style={styles.iconsContainer}>
          <MaterialIcons
            name={icon1}
            size={32}
            style={styles.icon}
            color="black"
          />
          <MaterialIcons
            name={icon2}
            size={32}
            style={styles.icon}
            color="black"
          />
        </View>

        {/* Title Line */}
        <View style={styles.titleLine}>
          <Text style={styles.titleText}>{title}</Text>
        </View>

        {/* Bottom-left Tag */}
        <View style={styles.tagPill}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      </View>
    </View>
  );
};

export default WidgetPreview;
