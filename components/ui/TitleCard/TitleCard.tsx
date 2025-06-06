import React from "react";
import { Container, TextAlignRight } from "./TitleCard.styles";
import { ThemedText } from "@/components/ThemedText";
import Textfield from "../Textfield/Textfield";
import { useActiveColorScheme } from "@/context/ThemeContext";

interface TitleCardProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  hasNoInputError?: boolean;
}

export const TitleCard: React.FC<TitleCardProps> = ({
  value,
  onChangeText,
  placeholder = "Add title...",
  hasNoInputError,
}) => {
  const colorScheme = useActiveColorScheme() ?? "light";

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
        placeholderText={`Add a title`}
        title={""}
        value={value}
        onChangeText={onChangeText}
        hasNoInputError={hasNoInputError}
        maxLength={30}
      />
    </Container>
  );
};
