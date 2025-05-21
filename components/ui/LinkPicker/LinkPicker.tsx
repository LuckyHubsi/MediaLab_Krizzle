// components/LinkPicker/LinkPicker.tsx
import React from "react";
import Textfield from "../Textfield/Textfield";

interface LinkPickerProps {
  title: string;
  value?: string;
  onChange: (text: string) => void;
}
const LinkPicker: React.FC<LinkPickerProps> = ({ title, value, onChange }) => {
  return (
    <Textfield
      title={title}
      placeholderText="Add a link here"
      value={value}
      onChangeText={onChange}
      textfieldIcon="attach-file"
      showTitle={true}
    />
  );
};

export default LinkPicker;
