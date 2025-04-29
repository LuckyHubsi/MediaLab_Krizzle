import { ThemedText } from "@/components/ThemedText";

import { FC } from "react";
import { Colors } from "@/constants/Colors";
import {
  MultiSelectContainer,
  MultiSelectPicker,
  IndividualSelect,
} from "./MultiSelectPicker.styles";
import { MaterialIcons } from "@expo/vector-icons";

interface MultiSelectPickerProps {
  title: string;
  multiselectArray: Array<string>;
  selectedTag: string | null;
  onSelectTag: (tag: string) => void;
}

const MultiSelectPickerProps: FC<MultiSelectPickerProps> = ({
  title,
  multiselectArray,
  selectedTag,
  onSelectTag,
}) => {
  const isSelected = selectedTag;

  return (
    <MultiSelectContainer>
      <ThemedText fontWeight="regular">{title}</ThemedText>
      <MultiSelectPicker>
        {multiselectArray.map((item, index) => (
          <IndividualSelect
            isSelected={!selectedTag}
            key={index}
            onPress={() => onSelectTag(item)}
          >
            {isSelected ? (
              <MaterialIcons
                name="check-circle"
                size={16}
                color="#FBFBFB"
                style={{ marginRight: 10 }}
              />
            ) : null}
            <ThemedText colorVariant={selectedTag ? "white" : "grey"}>
              {item}
            </ThemedText>
          </IndividualSelect>
        ))}
      </MultiSelectPicker>
    </MultiSelectContainer>
  );
};

export default MultiSelectPickerProps;
