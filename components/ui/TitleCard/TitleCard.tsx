import React from "react";
import { View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  Container,
  Label,
  InputWrapper,
  StyledTitleInput,
  TextIcon,
  TextAlignRight,
} from "./TitleCard.styles";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedText } from "@/components/ThemedText";
import Textfield from "../Textfield/Textfield";

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
      <ThemedText fontSize="regular">Title</ThemedText>
      <TextAlignRight>
        <ThemedText fontSize="s" colorVariant="red">
          * required
        </ThemedText>
      </TextAlignRight>
      <Textfield
        showTitle={false}
        textfieldIcon="text-fields"
        placeholderText={`Add a title to your note`}
        title={""}
        value={value}
        onChangeText={onChangeText}
      />
    </Container>
  );
};
