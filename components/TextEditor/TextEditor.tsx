import React, { useEffect, useState } from "react";
import {
  AppState,
  AppStateStatus,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from "react-native";
import { useEditorBridge, RichText, Toolbar } from "@10play/tentap-editor";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { customEditorHtml } from "./TextEditorCustomHtml";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

const TextEditor: React.FC = () => {
  const colorScheme = useColorScheme();
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

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
    onChange: async () => {
      const html = await editor.getHTML();
      debouncedSave.debouncedFunction(html);
    },
  });

  const saveNote = async (html: string) => {
    console.log("Saving note:", html);
    // updateNoteContent(id, html); // TODO: have id ready to be passed
  };

  const debouncedSave = useDebouncedCallback(saveNote, 1000);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        editor.getHTML().then((html) => {
          debouncedSave.flush(html);
        });
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => {
      subscription.remove();
    };
  }, [appState, debouncedSave, editor]);

  // Handling the toolbar above keyboard for iOs and Android (keep comment in for future use)
  const { top } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const headerHeight = isLandscape ? 32 : 68;
  const keyboardVerticalOffset = headerHeight + top;

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
        keyboardVerticalOffset={keyboardVerticalOffset}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <Toolbar editor={editor} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const initialContent = "";

export default TextEditor;
