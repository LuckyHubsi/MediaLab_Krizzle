import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  View,
} from "react-native";
import { useEditorBridge, RichText, Toolbar } from "@10play/tentap-editor";
import { Colors } from "@/constants/Colors";

const TextEditor: React.FC = () => {
  const colorScheme = useColorScheme();

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: "Type here...",
  });

  return (
    <View style={{ flex: 1 }}>
      <RichText
        editor={editor}
        style={{
          flex: 1,
          padding: 20,
          /*backgroundColor:
            colorScheme === "dark"
              ? Colors.dark.background
              : Colors.light.background,*/
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          position: "absolute",
          bottom: 0,
        }}
      >
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default TextEditor;
