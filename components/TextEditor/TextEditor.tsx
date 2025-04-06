import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  View,
} from "react-native";
import {
  useEditorBridge,
  RichText,
  Toolbar,
  editorHtml,
} from "@10play/tentap-editor";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { customEditorHtml } from "./TextEditorCustomHtml";

const TextEditor: React.FC = () => {
  const colorScheme = useColorScheme();

  const editor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: true,
    initialContent: initialContent,
    dynamicHeight: true,
    customSource: customEditorHtml.replace(
      "/*REPLACE_THEME*/",
      `document.body.dataset.theme = '${colorScheme}';`,
    ),
    theme: {
      toolbar: {
        toolbarBody: {
          backgroundColor: "black",
        },
        toolbarButton: {
          backgroundColor:
            colorScheme === "dark"
              ? Colors.dark.background
              : Colors.light.background,
        },
        icon: {
          tintColor:
            colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
        },
        iconWrapper: {
          backgroundColor:
            colorScheme === "dark"
              ? Colors.dark.background
              : Colors.light.background,
        },
        iconWrapperActive: {
          backgroundColor:
            colorScheme === "dark"
              ? Colors.dark.background
              : Colors.light.background,
        },
        iconWrapperDisabled: {
          backgroundColor:
            colorScheme === "dark"
              ? Colors.dark.background
              : Colors.light.background,
        },
        iconDisabled: {
          tintColor:
            colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
        },
        iconActive: {
          tintColor:
            colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
        },
      },
    },
    // onChange: async () => {
    //   const html = await editor.getHTML();
    //   console.log("Editor HTML:", html);
    // },
  });

  // // Handling the toolbar above keyboard for iOs and Android (keep comment in for future use)
  // const { top } = useSafeAreaInsets();
  // const { width, height } = useWindowDimensions();
  // const isLandscape = width > height;
  // const headerHeight = isLandscape ? 32 : 44;
  // // const headerHeight = isLandscape ? 32 : 55;
  // const keyboardVerticalOffset = headerHeight + top;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          colorScheme === "dark"
            ? Colors.dark.background
            : Colors.light.background,
      }}
    >
      <RichText
        editor={editor}
        style={{
          flex: 1,
          padding: 20,
          top: 0,
          backgroundColor:
            colorScheme === "dark"
              ? Colors.dark.background
              : Colors.light.background,
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // Handling the toolbar above keyboard for iOs and Android (keep comment in for future use)
        // keyboardVerticalOffset={keyboardVerticalOffset}
        style={{
          position: "absolute",
          bottom: 0,
        }}
      >
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const initialContent = "";

export default TextEditor;
