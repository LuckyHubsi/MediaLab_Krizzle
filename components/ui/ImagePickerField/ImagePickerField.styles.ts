// components/ImagePickerField/ImagePickerField.styles.ts
import { Colors } from "@/constants/Colors";
import { ColorSchemeProps } from "@/context/ThemeContext";
import styled from "styled-components/native";

export const ImagePickerContainer = styled.View`
  gap: 8px;
`;

export const ImageUploadContainer = styled.View`
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 20px;
  border-radius: 16px;
  border-width: 1px;
  border-color: ${({ colorScheme }: ColorSchemeProps) =>
    colorScheme === "dark" ? Colors.grey100 : Colors.grey50};
  height: 130px;
  margin-bottom: 5px;
  margin-top: 10px;
`;
export const ImageButton = styled.TouchableOpacity`
  background-color: ${Colors.primary};
  border-radius: 30px;
  padding-vertical: 12px;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-bottom: 0px;
`;

export const CameraButton = styled.TouchableOpacity`
  border: 1px solid ${Colors.primary};
  border-radius: 30px;
  padding-vertical: 12px;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 8px;
  margin-top: 5px;
`;

export const DeleteButton = styled.TouchableOpacity<ColorSchemeProps>`
  border: 1px solid
    ${({ colorScheme }: ColorSchemeProps) => Colors[colorScheme].negative};
  border-radius: 30px;
  padding-vertical: 12px;
  margin-top: 5px;
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 8px;
`;

export const ImagePreview = styled.Image`
  width: 100%;
  height: 180px;
  border-radius: 16px;
  margin-top: 10px;
`;
