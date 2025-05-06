import { ThemedText } from "@/components/ThemedText";
import { FC } from "react";
import { Colors } from "@/constants/Colors";
import {
  MultiSelectContainer,
  MultiSelectPicker as MultiSelectPickerWrapper,
  IndividualSelect,
} from "./MultiSelectPicker.styles";
import { MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";

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
      <ThemedText fontWeight="regular">{title}</ThemedText>
      <MultiSelectPickerWrapper>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {multiselectArray.map((item, index) => {
            const isSelected = selectedTags.includes(item);
            return (
              <IndividualSelect
                key={index}
                isSelected={isSelected}
                onPress={() => onSelectTag(item)}
              >
                {isSelected && (
                  <MaterialIcons
                    name="check-circle"
                    size={16}
                    color="#FBFBFB"
                    style={{ marginRight: 5 }}
                  />
                )}
                <ThemedText colorVariant={isSelected ? "white" : "grey"}>
                  {item}
                </ThemedText>
              </IndividualSelect>
            );
          })}
        </View>
      </MultiSelectPickerWrapper>
    </MultiSelectContainer>
  );
};

export default MultiSelectPicker;
