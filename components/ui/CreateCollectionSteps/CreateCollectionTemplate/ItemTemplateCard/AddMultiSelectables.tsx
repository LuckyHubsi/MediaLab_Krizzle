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

/**
 * Component for adding multiple selectable items in a collection template.
 * Allows users to add, edit, and remove selectables with a maximum limit of 20.
 * @param title (required) - The title of the multi-selectable section.
 * @param options (required) - The current list of selectable items.
 * @param onOptionsChange (required) - Callback function to handle changes to the selectable items.
 * @param errorMessage - Optional error message to display if there are validation issues.
 */

interface AddMultiSelectablesProps {
  title: string;
  options: string[];
  onOptionsChange: (newOptions: string[]) => void;
  errorMessage?: string;
}

const AddMultiSelectables: FC<AddMultiSelectablesProps> = ({
  options,
  onOptionsChange,
  errorMessage,
}) => {
  const colorScheme = useActiveColorScheme();

  /**
   * Function to handle the click of the "Add" button, adding a new selectable item.
   * Ensures that the number of options does not exceed 20.
   */
  const handleAddButtonClick = () => {
    if (options.length < 20) {
      onOptionsChange([...options, ""]);
    }
  };

  /**
   * Function to handle changes to the text input for each selectable item.
   * @param index - The index of the selectable item being edited.
   * @param value - The new value for the selectable item.
   */
  const handleInputChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    onOptionsChange(updated);
  };

  /**
   * Function to handle the removal of a selectable item.
   * @param indexToRemove - The index of the selectable item to be removed.
   */
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

          <TouchableOpacity
            onPress={() => handleRemoveTextfield(index)}
            style={{
              width: 48,
              height: 48,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialIcons
              name="delete"
              size={24}
              color={Colors[colorScheme].negative}
            />
          </TouchableOpacity>
        </SelectablesContainer>
      ))}
      {options.length < 20 && (
        <AddMultiSelectableButton
          colorScheme={colorScheme}
          onPress={handleAddButtonClick}
        >
          <MaterialIcons
            name="add-circle"
            size={24}
            color={colorScheme === "light" ? Colors.primary : Colors.secondary}
          />
          <ThemedText colorVariant="primary">Add a selectable</ThemedText>
        </AddMultiSelectableButton>
      )}
      {/* Display error message if provided */}
      {errorMessage && (
        <ThemedText fontSize="s" colorVariant="red">
          {errorMessage}
        </ThemedText>
      )}
    </AddMultiSelectablesContainer>
  );
};
export default AddMultiSelectables;
