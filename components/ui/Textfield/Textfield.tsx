import { ThemedText } from "@/components/ThemedText";
import {
  InputWrapper,
  StyledTextInput,
  TextfieldContainer,
} from "./Textfield.styles";
import { FC } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useActiveColorScheme } from "@/context/ThemeContext";

/**
 * Component for displaying a text input field with an optional title and icon.
 *
 * @param title (required) - The title of the text field.
 * @param showTitle - Whether to show the title (default: true).
 * @param placeholderText (required) - The placeholder text for the input field.
 * @param editable - Whether the input field is editable (default: true).
 * @param textfieldIcon - The icon to display in the input field (default: "short-text").
 * @param onChangeText - Callback function to handle text changes.
 * @param value - The current value of the input field.
 * @param hasNoInputError - Whether to show an error message for empty input (default: false).
 * @param maxLength - Maximum length of the input text (default: no limit).
 * @param multiline - Whether the input field supports multiple lines (default: false).
 * @param hasDuplicateTitle - Whether to show an error message for duplicate titles (default: false).
 */

interface TextfieldProps {
  title: string;
  showTitle?: boolean;
  placeholderText: string;
  editable?: boolean;
  textfieldIcon?: keyof typeof MaterialIcons.glyphMap;
  onChangeText?: (text: string) => void;
  value?: string;
  hasNoInputError?: boolean;
  maxLength?: number;
  multiline?: boolean;
  hasDuplicateTitle?: boolean;
}

const Textfield: FC<TextfieldProps> = ({
  title,
  placeholderText,
  editable = true,
  showTitle = true,
  textfieldIcon = "short-text",
  onChangeText,
  value,
  hasNoInputError,
  maxLength,
  hasDuplicateTitle,
  multiline = false,
}) => {
  const colorScheme = useActiveColorScheme();

  return (
    <TextfieldContainer>
      {showTitle ? <ThemedText fontWeight="regular">{title}</ThemedText> : null}
      <InputWrapper colorScheme={colorScheme}>
        <MaterialIcons
          name={textfieldIcon}
          size={20}
          color={colorScheme === "light" ? Colors.light.text : Colors.dark.text}
          accessible={false}
          importantForAccessibility="no"
        />
        <StyledTextInput
          colorScheme={colorScheme}
          editable={editable}
          onChangeText={onChangeText}
          value={value}
          placeholderTextColor={
            colorScheme === "light" ? Colors.grey100 : Colors.grey50
          }
          placeholder={placeholderText}
          maxLength={maxLength}
          multiline={multiline}
        />
      </InputWrapper>
      {hasNoInputError && (
        <ThemedText fontSize="s" colorVariant="red">
          Oops, this field is required. Please enter a text.
        </ThemedText>
      )}

      {hasDuplicateTitle && (
        <ThemedText fontSize="s" colorVariant="red">
          Oops, here you have a duplicate Title.
        </ThemedText>
      )}
    </TextfieldContainer>
  );
};

export default Textfield;
