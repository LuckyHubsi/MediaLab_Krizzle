import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  AccessibilityInfo,
  findNodeHandle,
} from "react-native";
import Textfield from "../Textfield/Textfield";
import { ThemedText } from "@/components/ThemedText";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { LinkPickerContainer, LinkTitleButton } from "./LinkPicker.styles";

/**
 * Component for selecting a link with an optional custom title.
 *
 * @param title (required) - The title of the link picker.
 * @param value - The current link value.
 * @param onChange (required) - Callback function to handle link value changes.
 * @param linkText - The custom link title.
 * @param onLinkTextChange (required) - Callback function to handle changes to the custom link title.
 */

interface LinkPickerProps {
  title: string;
  value?: string;
  onChange: (text: string) => void;
  linkText?: string;
  onLinkTextChange: (text: string) => void;
}

const LinkPicker: React.FC<LinkPickerProps> = ({
  title,
  value = "",
  onChange,
  linkText = "",
  onLinkTextChange,
}) => {
  const [showCustomTextfield, setShowCustomTextfield] = useState(!!linkText);
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? Colors.grey50 : Colors.grey100;
  const titleRef = useRef(null);

  /**
   * Handles the removal of custom text for the link title.
   */
  const handleRemoveCustomText = () => {
    setShowCustomTextfield(false);
    onLinkTextChange("");
  };

  /**
   * Effect to show the custom text field if a link title is provided.
   */
  useEffect(() => {
    if (linkText) {
      setShowCustomTextfield(true);
    }
  }, [linkText]);

  return (
    <>
      <ThemedText
        fontWeight="regular"
        fontSize="regular"
        accessibilityLabel={`label ${title}`}
        nativeID={title}
        optionalRef={titleRef}
      >
        {title}
      </ThemedText>
      <LinkPickerContainer>
        <Textfield
          title="Link"
          placeholderText="www.krizzle.com"
          value={value}
          onChangeText={onChange}
          textfieldIcon="attach-file"
          showTitle={true}
        />

        {!showCustomTextfield ? (
          <TouchableOpacity
            onPress={() => setShowCustomTextfield(true)}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Add a custom link title or display text for ${title}`}
            accessibilityHint="Opens a new text input field"
          >
            <LinkTitleButton>
              <MaterialIcons
                name="add"
                size={20}
                color={
                  colorScheme === "dark" ? Colors.secondary : Colors.primary
                }
                accessible={false}
              />
              <ThemedText fontWeight="bold" fontSize="s" colorVariant="primary">
                Add custom link title
              </ThemedText>
            </LinkTitleButton>
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <View style={{ flex: 1, marginTop: 8 }}>
              <Textfield
                title="Custom Link Title"
                placeholderText="Krizzle"
                value={linkText}
                onChangeText={onLinkTextChange}
                textfieldIcon="edit"
                showTitle={true}
                multiline={false}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                handleRemoveCustomText();
                const reactTag = findNodeHandle(titleRef.current);
                if (reactTag) {
                  AccessibilityInfo.setAccessibilityFocus(reactTag);
                }
              }}
              style={{ marginLeft: 8, marginBottom: 12 }}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Remove selected custom link title for ${title}`}
            >
              <MaterialIcons
                name="close"
                size={24}
                color={iconColor}
                accessible={false}
              />
            </TouchableOpacity>
          </View>
        )}
      </LinkPickerContainer>
    </>
  );
};

export default LinkPicker;
