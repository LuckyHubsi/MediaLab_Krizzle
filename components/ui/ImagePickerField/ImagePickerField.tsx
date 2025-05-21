// components/ImagePickerField/ImagePickerField.tsx
import React from "react";
import { TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  ImagePickerContainer,
  ImageButton,
  ImagePreview,
  CameraButton,
  DeleteButton,
  ImageUploadContainer,
} from "./ImagePickerField.styles";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { DividerWithLabel } from "../DividerWithLabel/DividerWithLabel";

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
              colorVariant="lightGrey"
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

          <DeleteButton onPress={() => onChange("")}>
            <MaterialIcons name="delete" size={20} color={Colors.negative} />
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
