import { ThemedText } from "@/components/ThemedText";
import { FC } from "react";
import {
  AndroidPickerWrapper,
  CollectionListContainer,
  getPickerStyles,
} from "./CollectionListDropdown.styles";
import RNPickerSelect from "react-native-picker-select";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import { useActiveColorScheme } from "@/context/ThemeContext";

interface CollectionListDropdownProps {
  title: string;
  collectionList: string[];
  selectedList: string;
  onSelectionChange: (value: string) => void;
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
      <ThemedText>{title}</ThemedText>
      <AndroidPickerWrapper>
        <RNPickerSelect
          placeholder={{ label: "Select an option...", value: null }}
          items={dropdownItems}
          value={selectedList}
          onValueChange={onSelectionChange}
          style={pickerStyles}
          Icon={() => (
            <MaterialIcons
              name="arrow-drop-down"
              size={24}
              color={colorScheme === "light" ? Colors.grey100 : Colors.white}
            />
          )}
        />
      </AndroidPickerWrapper>
    </CollectionListContainer>
  );
};

export default CollectionListDropdown;
