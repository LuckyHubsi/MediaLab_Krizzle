import { ThemedText } from "@/components/ThemedText";
import {
  InputWrapper,
  StyledTextInput,
  TextfieldContainter,
} from "./CollectionTextField.style";
import { FC, SetStateAction, useState } from "react";
import { Colors } from "@/constants/Colors";
import { useActiveColorScheme } from "@/context/ThemeContext";

interface CollectionTextfieldProps {
  title?: string;
  placeholderText?: string;
  editable?: boolean;
  //   onChangeText: (text: string) => void;
  //   value: string;
}

const CollectionTextfield: FC<CollectionTextfieldProps> = ({
  title,
  placeholderText,
  editable = true,
  // onChangeText,
  //  value
}) => {
  const [value, onChangeText] = useState(placeholderText);
  const colorScheme = useActiveColorScheme();

  return (
    <TextfieldContainter>
      <ThemedText fontWeight="regular">{title}</ThemedText>
      <InputWrapper colorScheme={colorScheme}>
        <StyledTextInput
          colorScheme={colorScheme}
          editable={editable}
          multiline={true} // Enable multiline input
          textAlignVertical="top" // Align text to the top
          placeholderTextColor={
            colorScheme === "light" ? Colors.black : Colors.white
          }
          //   onChangeText={onChangeText}
          //   value={value}
          placeholder={placeholderText}
        />
      </InputWrapper>
    </TextfieldContainter>
  );
};

export default CollectionTextfield;
