import React, { useEffect, useState } from "react";
import {
  AppState,
  AppStateStatus,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
import { customEditorHtml } from "./TextEditorCustomHtml";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { ThemedText } from "../ThemedText";

/**
 * Text editor component that allows users to create and edit rich text content.
 *
 * @param initialContent - The initial HTML content to load into the editor.
 * @param onChange - Callback function that is called whenever the content changes.
 */

interface TextEditorProps {
  initialContent: string;
  onChange: (html: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({
  initialContent,
  onChange,
}) => {
  const colorScheme = useActiveColorScheme();
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  /**
   * Dummy object used to call item.image() for filtering toolbar buttons
   * This is necessary because the item.image() function expects an object with
   * specific properties, but we don't need to use the actual editor state in this case.
   * This is a workaround to avoid errors when filtering out specific toolbar items.
   */
  const dummyArgs = {
    editor: {} as any,
    editorState: {} as any,
    setToolbarContext: () => {},
    toolbarContext: 0,
  };

  /**
   * Filter out specific toolbar items that are not needed in this editor.
   */
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
  /**
   * Initialize the editor with the provided initial content and custom HTML file.
   * This setup includes a custom toolbar and theme based on the active color scheme.
   */
  const editor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: true,
    initialContent: initialContent,
    dynamicHeight: false,
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
      const plainText = html.replace(/<[^>]*>/g, "").trim();

      /**
       * Check if the plain text content exceeds the character limit of 5000 characters
       * If it does, set the charLimitExceeded state to true and prevent further changes
       */
      if (plainText.length <= 5000) {
        setCharLimitExceeded(false);
        onChange(html);
      } else {
        setCharLimitExceeded(true);
        editor.undo();
      }
    },
  });

  /**
   * Effect to handle app state changes. When the app goes inactive or to the background,
   * it saves the current HTML content of the editor.
   */
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

  const { top } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const headerHeight = isLandscape ? 32 : 68;
  const keyboardVerticalOffset = headerHeight + top;
  const [charLimitExceeded, setCharLimitExceeded] = useState(false);
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
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <RichText
          editor={editor}
          accessible={true}
          accessibilityLabel="Note Editor"
          accessibilityHint="Double tap to activate and edit the note or swipe right two times to read out the note content. Be aware that editing the note with TalkBack can lead to unexpected behaviour."
          accessibilityRole="button"
        />
      </ScrollView>
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
        <View
          accessible={true}
          accessibilityLabel="Text formatting toolbar"
          accessibilityRole="toolbar"
          accessibilityViewIsModal={true}
        >
          <Toolbar editor={editor} items={toolbarItems} />
        </View>
      </KeyboardAvoidingView>
      {charLimitExceeded && (
        <View style={{ padding: 8, backgroundColor: "red" }}>
          <ThemedText fontWeight="bold" lightColor="white" darkColor="white">
            Character limit exceeded! Please reduce the content to 5000
            characters.
          </ThemedText>
        </View>
      )}
    </View>
  );
};

export default TextEditor;
