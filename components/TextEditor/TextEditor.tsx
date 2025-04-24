// TextEditor.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  AppState,
  AppStateStatus,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  View,
} from "react-native";
import {
  useEditorBridge,
  RichText,
  Toolbar,
  DEFAULT_TOOLBAR_ITEMS,
  Images,
} from "@10play/tentap-editor";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { customEditorHtml } from "./TextEditorCustomHtml";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

interface TextEditorProps {
  initialContent: string;
  onChange: (html: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  initialContent,
  onChange,
}) => {
  const colorScheme = useColorScheme();
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  // Dummy object used to call item.image() for filtering toolbar buttons
  // The image() function expects an ArgsToolbarCB object,
  // but since we’re only interested in comparing the returned image (icon),
  // we don’t need real editor behavior here — just placeholders that satisfy the type.
  const dummyArgs = {
    editor: {} as any,
    editorState: {} as any,
    setToolbarContext: () => {},
    toolbarContext: 0,
  };

  const toolbarItems = DEFAULT_TOOLBAR_ITEMS.filter((item) => {
    const img = item.image(dummyArgs);
    return (
      img !== Images.code &&
      img !== Images.link &&
      img !== Images.quote &&
      img !== Images.outdent &&
      img !== Images.indent
    );
  });

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
              ? Colors.dark.ToolbarBarButtonBackground
              : Colors.light.ToolbarBarButtonBackground,
        },
        iconWrapperActive: {
          backgroundColor:
            colorScheme === "dark"
              ? Colors.dark.ToolbarBarButtonBackgroundActive
              : Colors.light.ToolbarBarButtonBackgroundActive,
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
      onChange(html);
    },
  });

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        editor.getHTML().then(onChange);
      }
      setAppState(nextAppState);
    };
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, [appState, onChange, editor]);

  // Handling the toolbar above keyboard for iOs and Android (keep comment in for future use)
  const { top } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const headerHeight = isLandscape ? 32 : 68;
  const keyboardVerticalOffset = headerHeight + top;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor:
          colorScheme === "dark"
            ? Colors.light.background
            : Colors.dark.background,
      }}
    >
      <RichText editor={editor} />
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
        <Toolbar editor={editor} items={toolbarItems} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default TextEditor;
