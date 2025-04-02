import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";

import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import React, { useRef, useState } from "react";
import { Keyboard } from "react-native";

const MyWebComponent = () => {
  const richTextRef = useRef(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardOpen(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardOpen(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ThemedView style={{ flex: 1, padding: 10 }}>
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          <RichEditor
            ref={richTextRef}
            initialContentHTML={
              "Hello <b>World</b> <p>this is a new paragraph</p> <p>this is another new paragraph</p>"
            }
            style={{ flex: 1, minHeight: 300 }}
            editorStyle={{
              backgroundColor: "#fff",
            }}
            nestedScrollEnabled={false}
          />
        </View>

        {isKeyboardOpen && (
          <View style={{ backgroundColor: "#f5f5f5" }}>
            <RichToolbar
              editor={richTextRef}
              actions={[
                actions.keyboard,
                actions.setBold,
                actions.setItalic,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.checkboxList,
                actions.undo,
                actions.redo,
              ]}
            />
          </View>
        )}
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

export default function TabTwoScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MyWebComponent />
    </SafeAreaView>
  );
}
