import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import Textfield from "../Textfield/Textfield";
import { ThemedText } from "@/components/ThemedText";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Link } from "expo-router";
import { LinkPickerContainer, LinkTitleButton } from "./LinkPicker.styles";

// Inside the component

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

  const handleRemoveCustomText = () => {
    setShowCustomTextfield(false);
    onLinkTextChange("");
  };

  return (
    <>
      <ThemedText fontWeight="regular" fontSize="regular">
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
          <TouchableOpacity onPress={() => setShowCustomTextfield(true)}>
            <LinkTitleButton>
              <MaterialIcons name="add" size={20} color={Colors.primary} />
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
              onPress={handleRemoveCustomText}
              style={{ marginLeft: 8, marginBottom: 12 }}
            >
              <MaterialIcons name="close" size={24} color={iconColor} />
            </TouchableOpacity>
          </View>
        )}
      </LinkPickerContainer>
    </>
  );
};

export default LinkPicker;
