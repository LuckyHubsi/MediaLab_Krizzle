import TextEditor from "@/components/TextEditor/TextEditor";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

export default function NotesScreen() {
  const { id, title } = useLocalSearchParams<{ id?: string; title?: string }>();

  useEffect(() => {
    if (id) {
      console.log("Opened note with ID:", id);
      // Fetch content for this note if needed
    }
  }, [id]);

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#111111" }}>
        <CustomStyledHeader
          title={title || "Note"}
          backBehavior="goHome"
          onIconPress={() => alert("Popup!")}
        />
        <TextEditor />
      </SafeAreaView>
    </>
  );
}
