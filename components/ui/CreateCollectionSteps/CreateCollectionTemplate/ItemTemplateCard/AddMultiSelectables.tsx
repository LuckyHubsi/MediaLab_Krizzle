import React, { FC, useState } from "react";
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
}

const AddMultiSelectables: FC<AddMultiSelectablesProps> = ({ title }) => {
  const colorScheme = useColorScheme();
  const [textfields, setTextfields] = useState<string[]>([]);

  const handleAddButtonClick = () => {
    setTextfields((prev) => [...prev, ""]);
  };

  const handleInputChange = (index: number, value: string) => {
    setTextfields((prev) => {
      const updatedTextfields = [...prev];
      updatedTextfields[index] = value;
      return updatedTextfields;
    });
  };

  const handleRemoveTextfield = (indexToRemove: number) => {
    setTextfields((prev) => prev.filter((_, index) => index !== indexToRemove));
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

      {textfields.length > 0 && <ThemedText>List of Selectables</ThemedText>}

      {textfields.map((textfieldValue, index) => (
        <SelectablesContainer key={index}>
          <TextfieldWrapper>
            <Textfield
              showTitle={false}
              title={""}
              placeholderText={"Enter Selectable"}
              textfieldIcon="bookmark"
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
