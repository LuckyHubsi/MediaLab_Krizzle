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
import { TouchableOpacity } from "react-native";
import Textfield from "@/components/ui/Textfield/Textfield";
import { useActiveColorScheme } from "@/context/ThemeContext";

interface AddMultiSelectablesProps {
  title: string;
  options: string[];
  onOptionsChange: (newOptions: string[]) => void;
  hasNoInputError?: boolean;
}

const AddMultiSelectables: FC<AddMultiSelectablesProps> = ({
  title,
  options,
  onOptionsChange,
  hasNoInputError,
}) => {
  const colorScheme = useActiveColorScheme();

  const handleAddButtonClick = () => {
    if (options.length < 20) {
      onOptionsChange([...options, ""]);
    }
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
      {options.length > 0 && <ThemedText>Add up to 20 Selectables</ThemedText>}
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
              maxLength={30}
            />
          </TextfieldWrapper>

          <TouchableOpacity onPress={() => handleRemoveTextfield(index)}>
            <MaterialIcons name="delete" size={24} color={Colors.negative} />
          </TouchableOpacity>
        </SelectablesContainer>
      ))}
      {options.length < 20 && (
        <AddMultiSelectableButton
          colorScheme={colorScheme}
          onPress={handleAddButtonClick}
        >
          <MaterialIcons name="add-circle" size={24} color={Colors.primary} />
          <ThemedText colorVariant="primary">Add a selectable</ThemedText>
        </AddMultiSelectableButton>
      )}
      {hasNoInputError && (
        <ThemedText fontSize="s" colorVariant={"red"}>
          Please enter a text in all fields.
        </ThemedText>
      )}
    </AddMultiSelectablesContainer>
  );
};

export default AddMultiSelectables;
