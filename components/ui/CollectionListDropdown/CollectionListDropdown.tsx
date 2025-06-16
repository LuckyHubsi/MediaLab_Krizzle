import { ThemedText } from "@/components/ThemedText";
import { FC } from "react";
import {
  AndroidPickerWrapper,
  CollectionListContainer,
} from "./CollectionListDropdown.styles";
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
  const dropdownItems = collectionList.map((item) => ({
    label: item,
    value: item,
  }));

  return (
    <CollectionListContainer>
      <ThemedText>{title}</ThemedText>
      <AndroidPickerWrapper colorScheme={colorScheme}>
        <CustomPicker
          placeholder={{}}
          items={dropdownItems}
          value={selectedList}
          onValueChange={onSelectionChange}
          colorScheme={colorScheme}
        />
      </AndroidPickerWrapper>
    </CollectionListContainer>
  );
};

export default CollectionListDropdown;
