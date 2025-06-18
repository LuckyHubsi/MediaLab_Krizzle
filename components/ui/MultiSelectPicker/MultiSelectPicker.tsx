import { ThemedText } from "@/components/ThemedText";
import { FC } from "react";
import {
  MultiSelectContainer,
  MultiSelectPicker as MultiSelectPickerWrapper,
  IndividualSelect,
  TagPill,
} from "./MultiSelectPicker.styles";
import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Colors } from "@/constants/Colors";

/**
 * Component for rendering a multi-select picker with a list of selectables.
 *
 * @param title - The title of the multi-select picker.
 * @param multiselectArray - An array of strings representing selectable items.
 * @param selectedTags (required) - An array of currently selected tags.
 * @param onSelectTag (required) - Callback function to handle tag selection changes.
 */

interface MultiSelectPickerProps {
  title?: string;
  multiselectArray?: Array<string>;
  selectedTags: string[];
  onSelectTag: (tag: string) => void;
}

const MultiSelectPicker: FC<MultiSelectPickerProps> = ({
  title,
  multiselectArray = [],
  selectedTags,
  onSelectTag,
}) => {
  return (
    <MultiSelectContainer>
      <ThemedText
        fontWeight="regular"
        accessibilityLabel={`Label ${title}`}
        nativeID={title}
      >
        {title}
      </ThemedText>
      <MultiSelectPickerWrapper
        accessible={true}
        accessibilityRole="radiogroup"
        accessibilityLabel="Selectables section"
        accessibilityLabelledBy={title}
      >
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {multiselectArray.map((item, index) => {
            const isSelected = selectedTags.includes(item);
            return (
              <IndividualSelect
                key={index}
                isSelected={isSelected}
                onPress={() => onSelectTag(item)}
                accessible={true}
                accessibilityRole="radio"
                accessibilityLabel={`selectable ${item}`}
                accessibilityHint={
                  isSelected
                    ? "Deselect the selectable"
                    : "Select the selectable"
                }
                accessibilityState={{ selected: isSelected }}
              >
                <TagPill isSelected={isSelected}>
                  {isSelected && (
                    <MaterialIcons
                      name="check-circle"
                      color={Colors.white}
                      style={{ marginRight: 5 }}
                    />
                  )}
                  <ThemedText colorVariant={isSelected ? "white" : "grey"}>
                    {item}
                  </ThemedText>
                </TagPill>
              </IndividualSelect>
            );
          })}
        </View>
      </MultiSelectPickerWrapper>
    </MultiSelectContainer>
  );
};

export default MultiSelectPicker;
