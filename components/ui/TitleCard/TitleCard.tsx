import React from "react";
import { View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  Container,
  Label,
  InputWrapper,
  StyledTitleInput,
  TextIcon,
} from "./TitleCard.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface TitleCardProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const TitleCard: React.FC<TitleCardProps> = ({
  value,
  onChangeText,
  placeholder = "Add title...",
}) => {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <Container>
      <Label colorScheme={colorScheme}>Title</Label>
      <InputWrapper colorScheme={colorScheme}>
        <TextIcon>
          <MaterialIcons
            name="text-fields"
            size={20}
            color={colorScheme === "light" ? "#333" : "#ccc"}
          />
        </TextIcon>
        <StyledTitleInput
          colorScheme={colorScheme}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colorScheme === "light" ? "#999" : "#666"}
        />
      </InputWrapper>
    </Container>
  );
};
