import React, { FC } from "react";
import {
  AddMultiSelectableButton,
  AddMultiSelectablesContainer,
  SelectablesContainer,
  TextfieldWrapper,
} from "../CreateCollectionTemplate.styles";
import { ThemedText } from "@/components/ThemedText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import { useColorScheme, TouchableOpacity } from "react-native";
import Textfield from "@/components/ui/Textfield/Textfield";

interface AddMultiSelectablesProps {
  title: string;
  options: string[];
  onOptionsChange: (newOptions: string[]) => void;
}

const AddMultiSelectables: FC<AddMultiSelectablesProps> = ({
  title,
  options,
  onOptionsChange,
}) => {
  const colorScheme = useColorScheme();

  const handleAddButtonClick = () => {
    onOptionsChange([...options, ""]);
  };

  const handleInputChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    onOptionsChange(updated);
  };

  const handleRemoveTextfield = (indexToRemove: number) => {
    const updated = options.filter((_, index) => index !== indexToRemove);
    onOptionsChange(updated);
  };

  return (
    <AddMultiSelectablesContainer>
      <AddMultiSelectableButton
        colorScheme={colorScheme}
        onPress={handleAddButtonClick}
      >
        <MaterialIcons name="add-circle" size={24} color={Colors.primary} />
        <ThemedText colorVariant="primary">Add a selectable</ThemedText>
      </AddMultiSelectableButton>

      {options.length > 0 && <ThemedText>List of Selectables</ThemedText>}

      {options.map((textfieldValue, index) => (
        <SelectablesContainer key={index}>
          <TextfieldWrapper>
            <Textfield
              showTitle={false}
              title={""}
              placeholderText={"Enter Selectable"}
              textfieldIcon="bookmark"
              value={textfieldValue}
              onChangeText={(text) => handleInputChange(index, text)}
            />
          </TextfieldWrapper>
          <TouchableOpacity onPress={() => handleRemoveTextfield(index)}>
            <MaterialIcons
              name="remove-circle"
              size={24}
              color={Colors.negative}
            />
          </TouchableOpacity>
        </SelectablesContainer>
      ))}
    </AddMultiSelectablesContainer>
  );
};

export default AddMultiSelectables;
