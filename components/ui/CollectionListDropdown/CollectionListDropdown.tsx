import { ThemedText } from "@/components/ThemedText";
import { FC } from "react";
import {
  AndroidPickerWrapper,
  CollectionListContainer,
} from "./CollectionListDropdown.styles";
import { useActiveColorScheme } from "@/context/ThemeContext";
import CustomPicker from "../CustomPicker/CustomPicker";

/**
 * Component for displaying a dropdown to select a collection list.
 * It allows users to choose from a list of collections and triggers a callback on selection change.
 * @param title (required) - The title of the dropdown.
 * @param collectionList (required) - An array of collection list names to display in the dropdown.
 * @param selectedList (required) - The currently selected collection list name.
 * @param onSelectionChange (required) - Callback function to handle changes in selection.
 */

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

  // Convert collectionList to dropdown items
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
