import React, { useEffect, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  ImagePickerContainer,
  ImageButton,
  ImagePreview,
  CameraButton,
  DeleteButton,
  ImageUploadContainer,
} from "./ImagePickerField.styles";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { DividerWithLabel } from "../DividerWithLabel/DividerWithLabel";
import { useActiveColorScheme } from "@/context/ThemeContext";
import Textfield from "../Textfield/Textfield";
import {
  AccessibilityInfo,
  findNodeHandle,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * Component for selecting an image in the item creation process, with an optional alt text field.
 *
 * @param title (required) - The title of the image picker field.
 * @param value - The current image URI.
 * @param onChange (required) - Callback function to handle image selection changes.
 * @param altText - Optional alt text for the image.
 * @param onAltTextChange - Callback function to handle alt text changes.
 */

interface ImagePickerFieldProps {
  title: string;
  value?: string;
  onChange: (uri: string) => void;
  altText?: string;
  onAltTextChange?: (text: string) => void;
}

const ImagePickerField: React.FC<ImagePickerFieldProps> = ({
  title,
  value,
  onChange,
  altText = "",
  onAltTextChange = () => {},
}) => {
  const colorScheme = useActiveColorScheme();
  const [showAltTextField, setShowAltTextField] = useState(!!altText);
  const titleRef = useRef(null);
  const altDescriptionRef = useRef(null);

  /**
   * Function to open the image picker and allow the user to select an image from their library.
   * The selected image will be returned as a URI.
   */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: false,
    });
    if (!result.canceled && result.assets.length > 0) {
      onChange(result.assets[0].uri);

      setTimeout(() => {
        const tag = findNodeHandle(altDescriptionRef.current);
        if (tag) {
          AccessibilityInfo.setAccessibilityFocus(tag);
        }
      }, 700);
    }
  };

  /**
   * Function to open the camera and allow the user to take a photo.
   * The photo will be returned as a URI.
   */
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      onChange(result.assets[0].uri);

      setTimeout(() => {
        const tag = findNodeHandle(altDescriptionRef.current);
        if (tag) {
          AccessibilityInfo.setAccessibilityFocus(tag);
        }
      }, 700);
    }
  };

  /**
   * Handles clearing the selected image and alt text.
   */
  const handleClearImage = () => {
    onChange("");
    onAltTextChange("");
    setShowAltTextField(false);

    const tag = findNodeHandle(titleRef.current);
    if (tag) {
      AccessibilityInfo.setAccessibilityFocus(tag);
    }
  };

  /**
   * Effect to show the alt text field if altText is provided.
   */
  useEffect(() => {
    if (altText) {
      setShowAltTextField(true);
    }
  }, [altText]);

  return (
    <ImagePickerContainer>
      <ThemedText
        fontWeight="regular"
        fontSize="regular"
        nativeID={title}
        optionalRef={titleRef}
        accessible={true}
        accessibilityLabel={`Label ${title}`}
      >
        {title}
      </ThemedText>

      {!value ? (
        <>
          <ImageUploadContainer>
            <ImageButton
              onPress={pickImage}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Upload image from device gallery  for ${title}`}
              accessibilityHint="Opens your photo library. You can select an image with a maximum of up to 10 MB"
              accessibilityLabelledBy={title}
            >
              <MaterialIcons
                name="add-photo-alternate"
                size={20}
                color="white"
                accessible={false}
              />
              <ThemedText
                fontWeight="bold"
                fontSize="s"
                colorVariant="white"
                accessible={false}
              >
                Upload Image
              </ThemedText>
            </ImageButton>

            <ThemedText
              fontWeight="light"
              fontSize="s"
              colorVariant="greyScale"
              accessible={false}
              importantForAccessibility="no"
            >
              10.0MB max file size
            </ThemedText>
          </ImageUploadContainer>
          <DividerWithLabel label="or" />
          <CameraButton
            onPress={takePhoto}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Open camera to take a new photo for ${title}`}
            accessibilityHint="Opens your camera app"
            accessibilityLabelledBy={title}
          >
            <MaterialIcons
              name="camera-alt"
              size={20}
              color={Colors.primary}
              accessible={false}
            />
            <ThemedText
              fontWeight="bold"
              fontSize="s"
              colorVariant="primary"
              accessible={false}
            >
              Open Camera
            </ThemedText>
          </CameraButton>
        </>
      ) : (
        <>
          <ImagePreview
            source={{ uri: value }}
            resizeMode="cover"
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel="Selected image preview"
          />
          <DeleteButton
            onPress={handleClearImage}
            colorScheme={colorScheme}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Clear selected image for ${title}`}
          >
            <MaterialIcons
              name="delete"
              size={20}
              color={Colors[colorScheme].negative}
              accessible={false}
            />
            <ThemedText
              fontWeight="bold"
              fontSize="s"
              colorVariant="red"
              accessible={false}
            >
              Clear Image
            </ThemedText>
          </DeleteButton>

          {/* Optional Alt Text Field */}
          {!showAltTextField ? (
            <CameraButton
              onPress={() => setShowAltTextField(true)}
              style={{ marginTop: 8 }}
              accessibilityRole="button"
              accessibilityLabel={`Add a custom image description for your selected image for ${title}`}
              accessibilityHint="Opens a new text input field"
              ref={altDescriptionRef}
            >
              <MaterialIcons
                name="add"
                size={20}
                color={
                  colorScheme === "dark" ? Colors.secondary : Colors.primary
                }
                accessible={false}
              />
              <ThemedText fontWeight="bold" fontSize="s" colorVariant="primary">
                Image Description
              </ThemedText>
            </CameraButton>
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                marginTop: 8,
              }}
            >
              <View style={{ flex: 1 }}>
                <Textfield
                  title="Image Description"
                  placeholderText="Describe the image"
                  value={altText}
                  onChangeText={onAltTextChange}
                  textfieldIcon="edit"
                  showTitle={true}
                  multiline={false}
                  maxLength={100}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  setShowAltTextField(false);
                  onAltTextChange("");

                  const tag = findNodeHandle(titleRef.current);
                  if (tag) {
                    AccessibilityInfo.setAccessibilityFocus(tag);
                  }
                }}
                style={{ marginLeft: 8, marginBottom: 12 }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Remove selected image description for ${title}`}
              >
                <MaterialIcons
                  name="close"
                  size={24}
                  color={Colors[colorScheme].text}
                  accessible={false}
                />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </ImagePickerContainer>
  );
};

export default ImagePickerField;
