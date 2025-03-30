import React, { useState } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "./HorizontalPicker.style";

interface HorizontalPickerProps {
  title: string;
  items: {
    id: string;
    label?: string;
    icon?: keyof typeof MaterialIcons.glyphMap;
    color?: string;
  }[];
  onSelect: (item: string) => void;
}

const HorizontalPicker: React.FC<HorizontalPickerProps> = ({
  title,
  items,
  onSelect,
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (item: string) => {
    setSelected(item);
    onSelect(item);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <FlatList
        horizontal
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, selected === item.id && styles.selectedItem]}
            onPress={() => handleSelect(item.id)}
          >
            {item.icon && (
              <MaterialIcons
                name={item.icon}
                size={32}
                color={selected === item.id ? "blue" : "black"}
              />
            )}
            {item.color && (
              <View
                style={[styles.colorCircle, { backgroundColor: item.color }]}
              />
            )}
            {item.label && <Text style={styles.label}>{item.label}</Text>}
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default HorizontalPicker;
