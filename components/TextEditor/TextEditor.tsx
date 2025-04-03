import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  View,
} from "react-native";
import { useEditorBridge, RichText, Toolbar } from "@10play/tentap-editor";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TextEditor: React.FC = () => {
  const colorScheme = useColorScheme();

  const editor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: true,
    initialContent: initialContent,
    dynamicHeight: true,
    // onChange: () => {
    //   console.log("Content changed:", initialContent);
    //   console.log("Content type:", typeof initialContent);
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
    <SafeAreaView style={{ flex: 1 }}>
      <RichText
        editor={editor}
        style={{
          flex: 1,
          padding: 20,
          top: 0,
          /*backgroundColor:
            colorScheme === "dark"
              ? Colors.dark.background
              : Colors.light.background,*/
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        // // Handling the toolbar above keyboard for iOs and Android (keep comment in for future use)
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

const initialContent = "Type here...";

export default TextEditor;
