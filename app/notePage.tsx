import TextEditor from "@/components/TextEditor/TextEditor";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { NoteDTO } from "@/dto/NoteDTO";
import { getNoteDataByPageID } from "@/services/NoteService";

export default function NotesScreen() {
  const { id, title } = useLocalSearchParams<{ id?: string; title?: string }>();

  useEffect(() => {
    if (id) {
      console.log("Opened note with ID:", id);
      const numericID = Number(id);
      console.log(numericID);
      if (!isNaN(numericID)) {
        (async () => {
          const noteData: NoteDTO | null = await getNoteDataByPageID(numericID);
          console.log(noteData);
        })();
      } else {
        console.error("Error fetching note data");
      }
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
