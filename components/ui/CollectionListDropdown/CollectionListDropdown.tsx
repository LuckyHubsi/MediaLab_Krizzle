import { ThemedText } from "@/components/ThemedText";
import { FC, useEffect, useState } from "react";
import {
  AndroidPickerWrapper,
  CollectionListContainer,
  getPickerStyles,
} from "./CollectionListDropdown.styles";
import RNPickerSelect from "react-native-picker-select";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import { useActiveColorScheme } from "@/context/ThemeContext";
import CustomPicker from "../CustomPicker/CustomPicker";

interface CollectionListDropdownProps {
  title: string;
  collectionList: string[];
  selectedList: string;
  onSelectionChange: (value: string | number) => void;
}

const CollectionListDropdown: FC<CollectionListDropdownProps> = ({
  title,
  collectionList,
  selectedList,
  onSelectionChange,
}) => {
  const colorScheme = useActiveColorScheme();
  const pickerStyles = getPickerStyles({ colorScheme: colorScheme ?? "light" });
  const dropdownItems = collectionList.map((item) => ({
    label: item,
    value: item,
  }));

  return (
    <CollectionListContainer>
      <ThemedText accessibilityLabel={`label ${title}`} nativeID={title}>
        {title}
      </ThemedText>
      <AndroidPickerWrapper colorScheme={colorScheme}>
        <CustomPicker
          placeholder={{}}
          items={dropdownItems}
          value={selectedList}
          onValueChange={onSelectionChange}
          colorScheme={colorScheme}
          accessibilityRole="combobox"
          accessibilityLabel="Collection List Dropdown"
          accessibilityLabelledBy={title}
        />
      </AndroidPickerWrapper>
    </CollectionListContainer>
  );
};

export default CollectionListDropdown;
