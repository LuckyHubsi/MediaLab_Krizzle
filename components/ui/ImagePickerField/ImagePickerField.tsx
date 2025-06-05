import React from "react";
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

/**
 * Component for selecting or an image in the item creation process.
 *
 * @param title (required) - The title of the image picker field.
 * @param value - The current image URI.
 * @param onChange (required) - Callback function to handle image selection changes.
 */

interface ImagePickerFieldProps {
  title: string;
  value?: string;
  onChange: (uri: string) => void;
}

const ImagePickerField: React.FC<ImagePickerFieldProps> = ({
  title,
  value,
  onChange,
}) => {
  const colorScheme = useActiveColorScheme();

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
    }
  };

  return (
    <ImagePickerContainer>
      <ThemedText fontWeight="regular" fontSize="regular">
        {title}
      </ThemedText>

      {!value ? (
        <>
          <ImageUploadContainer>
            <ImageButton onPress={pickImage}>
              <MaterialIcons
                name="add-photo-alternate"
                size={20}
                color="white"
              />
              <ThemedText fontWeight="bold" fontSize="s" colorVariant="white">
                Upload Image
              </ThemedText>
            </ImageButton>

            <ThemedText
              fontWeight="light"
              fontSize="s"
              colorVariant="greyScale"
            >
              10.0MB max file size
            </ThemedText>
          </ImageUploadContainer>
          <DividerWithLabel label="or" />
          <CameraButton onPress={takePhoto}>
            <MaterialIcons name="camera-alt" size={20} color={Colors.primary} />
            <ThemedText fontWeight="bold" fontSize="s" colorVariant="primary">
              Open Camera
            </ThemedText>
          </CameraButton>
        </>
      ) : (
        <>
          <ImagePreview source={{ uri: value }} resizeMode="cover" />
          <DeleteButton onPress={() => onChange("")} colorScheme={colorScheme}>
            <MaterialIcons
              name="delete"
              size={20}
              color={Colors[colorScheme].negative}
            />
            <ThemedText fontWeight="bold" fontSize="s" colorVariant="red">
              Clear Image
            </ThemedText>
          </DeleteButton>
        </>
      )}
    </ImagePickerContainer>
  );
};

export default ImagePickerField;
