import React from "react";
import { Container, TextAlignRight } from "./TitleCard.styles";
import { ThemedText } from "@/components/ThemedText";
import Textfield from "../Textfield/Textfield";

/**
 * Component for displaying a title input card in the create/edit widget flow.
 *
 * @param value (required) - The current value of the title input.
 * @param onChangeText (required) - Callback function to handle text changes.
 * @param placeholder - Placeholder text for the input field (default: "Add a title...").
 * @param hasNoInputError - Whether to show an error message for empty input (default: false).
 */

interface TitleCardProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  hasNoInputError?: boolean;
}

export const TitleCard: React.FC<TitleCardProps> = ({
  value,
  onChangeText,
  placeholder = "Add a title...",
  hasNoInputError,
}) => {
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
        placeholderText={placeholder}
        title={""}
        value={value}
        onChangeText={onChangeText}
        hasNoInputError={hasNoInputError}
        maxLength={30}
      />
    </Container>
  );
};
