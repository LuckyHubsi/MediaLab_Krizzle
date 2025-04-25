import { ThemedText } from "@/components/ThemedText";
import {
  InputWrapper,
  StyledTextInput,
  TextfieldContainter,
} from "./Textfield.styles";
import { FC, SetStateAction, useState } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface TextfieldProps {
  title?: string;
  placeholderText?: string;
  editable?: boolean;
  //   onChangeText: (text: string) => void;
  //   value: string;
}

const Textfield: FC<TextfieldProps> = ({
  title,
  placeholderText,
  editable = true,
  // onChangeText,
  //  value
}) => {
  const [value, onChangeText] = useState(placeholderText);
  const colorScheme = useColorScheme();

  return (
    <TextfieldContainter>
      <ThemedText fontWeight="regular">{title}</ThemedText>
      <InputWrapper colorScheme={colorScheme}>
        <MaterialIcons
          name="short-text"
          size={20}
          color={colorScheme === "light" ? "#333" : "#ccc"}
        />
        <StyledTextInput
          colorScheme={colorScheme}
          editable={editable}
          //   onChangeText={onChangeText}
          //   value={value}
          placeholderTextColor={
            colorScheme === "light" ? Colors.grey100 : Colors.grey50
          }
          placeholder={placeholderText}
        />
      </InputWrapper>
    </TextfieldContainter>
  );
};

export default Textfield;
