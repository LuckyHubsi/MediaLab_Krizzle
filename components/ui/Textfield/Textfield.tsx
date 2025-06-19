import { ThemedText } from "@/components/ThemedText";
import {
  InputWrapper,
  StyledTextInput,
  TextfieldContainer,
} from "./Textfield.styles";
import { FC, useEffect, useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { AccessibilityInfo, findNodeHandle, View } from "react-native";
import { useSnackbar } from "../Snackbar/Snackbar";

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
 * @param isRequired - Whether the input field is required (default: false).
 * @param optNativeID - USed when showTitle is set to false - changes the nativeID of the label.
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
  isRequired?: boolean;
  optNativeID?: string;
  extraInfo?: string;
  optionalRef?: any;
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
  isRequired = false,
  optNativeID = null,
  extraInfo = "",
  optionalRef,
}) => {
  const colorScheme = useActiveColorScheme();
  const { whenSnackbarComplete } = useSnackbar();

  const errorMessageRef = useRef(null);
  useEffect(() => {
    if (hasNoInputError || hasDuplicateTitle) {
      whenSnackbarComplete(() => {
        const node = findNodeHandle(errorMessageRef.current);
        if (node) {
          AccessibilityInfo.setAccessibilityFocus(node);
        }
      });
    }
  }, [hasNoInputError, hasDuplicateTitle]);

  return (
    <TextfieldContainer>
      <View accessible={true} accessibilityRole="none">
        {showTitle ? (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <ThemedText
              fontWeight="regular"
              nativeID={title}
              accessibilityLabel={`Label ${title}`}
            >
              {title}
            </ThemedText>
            {isRequired && (
              <ThemedText
                fontSize="s"
                colorVariant="red"
                accessibilityLabel={`Input required`}
              >
                * required
              </ThemedText>
            )}
          </View>
        ) : null}

        {maxLength && (
          <ThemedText
            fontSize="s"
            fontWeight="light"
            colorVariant={colorScheme === "light" ? "grey" : "lightGrey"}
            accessibilityLabel={`max. ${maxLength} characters ${extraInfo}`}
          >
            max. {maxLength} chars
          </ThemedText>
        )}
      </View>
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
          accessible={true}
          accessibilityLabelledBy={optNativeID ? optNativeID : title}
          ref={optionalRef}
        />
      </InputWrapper>
      {hasNoInputError && (
        <ThemedText
          fontSize="s"
          colorVariant="red"
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          accessible={true}
          optionalRef={errorMessageRef}
        >
          Oops, the above field is required. Please enter a text.
        </ThemedText>
      )}

      {hasDuplicateTitle && (
        <ThemedText
          fontSize="s"
          colorVariant="red"
          accessibilityLiveRegion="assertive"
          accessibilityRole="alert"
          accessible={true}
          optionalRef={errorMessageRef}
        >
          Oops, here you have a duplicate Title.
        </ThemedText>
      )}
    </TextfieldContainer>
  );
};

export default Textfield;
