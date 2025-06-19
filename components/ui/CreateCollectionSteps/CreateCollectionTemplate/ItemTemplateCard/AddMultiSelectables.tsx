import React, { FC, useEffect, useRef } from "react";
import {
  AddMultiSelectableButton,
  AddMultiSelectablesContainer,
  SelectablesContainer,
  TextfieldWrapper,
} from "../CreateCollectionTemplate.styles";
import { ThemedText } from "@/components/ThemedText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "@/constants/Colors";
import {
  AccessibilityInfo,
  findNodeHandle,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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
  const textfieldRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (options.length === 0) return;

    const lastInput = textfieldRefs.current[options.length - 1];
    if (lastInput) {
      // Set accessibility focus too
      const nodeHandle = findNodeHandle(lastInput);
      if (nodeHandle) {
        setTimeout(() => {
          AccessibilityInfo.setAccessibilityFocus(nodeHandle);
        }, 100); // Delay is important to let layout stabilize
      }
    }
  }, [options.length]);

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

    textfieldRefs.current.splice(indexToRemove, 1);
  };

  return (
    <AddMultiSelectablesContainer>
      <ThemedText>Add up to 20 Selectables</ThemedText>
      <ThemedText
        fontSize="s"
        fontWeight="light"
        colorVariant={colorScheme === "light" ? "grey" : "lightGrey"}
        accessibilityLabel={`max. 30 characters per selectable`}
      >
        max. 30 characters per selectable
      </ThemedText>
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
              showMaxLength={false}
              optionalRef={(input: any) => {
                textfieldRefs.current[index] = input; // keep list in sync
              }}
            />
          </TextfieldWrapper>

          <TouchableOpacity
            onPress={() => handleRemoveTextfield(index)}
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
            accessibilityRole="button"
            accessibilityLabel={`Remove selectable ${textfieldValue ? `${textfieldValue}` : "empty selectable"}`}
          >
            <View
              style={{
                height: 48,
                width: 48,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialIcons
                name="delete"
                size={24}
                color={Colors[colorScheme].negative}
              />
            </View>
          </TouchableOpacity>
        </SelectablesContainer>
      ))}
      {options.length < 20 && (
        <AddMultiSelectableButton
          colorScheme={colorScheme}
          onPress={handleAddButtonClick}
          accessibilityRole="button"
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
