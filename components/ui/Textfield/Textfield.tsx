import { ThemedText } from "@/components/ThemedText";
import {
  InputWrapper,
  StyledTextInput,
  TextfieldContainer,
} from "./Textfield.styles";
import { FC } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useActiveColorScheme } from "@/context/ThemeContext";

interface TextfieldProps {
  title: string;
  showTitle?: boolean;
  placeholderText: string;
  editable?: boolean;
  textfieldIcon?: keyof typeof MaterialIcons.glyphMap;
  onChangeText?: (text: string) => void;
  value?: string;
}

const Textfield: FC<TextfieldProps> = ({
  title,
  placeholderText,
  editable = true,
  showTitle = true,
  textfieldIcon = "short-text",
  onChangeText,
  value,
}) => {
  const colorScheme = useActiveColorScheme();

  return (
    <TextfieldContainer>
      {showTitle ? <ThemedText fontWeight="regular">{title}</ThemedText> : null}
      <InputWrapper colorScheme={colorScheme}>
        <MaterialIcons
          name={textfieldIcon}
          size={20}
          color={colorScheme === "light" ? "#333" : "#ccc"}
        />
        <StyledTextInput
          colorScheme={colorScheme}
          editable={editable}
          onChangeText={onChangeText}
          value={value}
          placeholderTextColor={
            colorScheme === "light" ? Colors.grey100 : Colors.grey50
          }
          placeholder={placeholderText}
        />
      </InputWrapper>
    </TextfieldContainer>
  );
};

export default Textfield;
