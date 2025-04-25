import TextEditor from "@/components/TextEditor/TextEditor";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppState, AppStateStatus, View } from "react-native";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { NoteDTO } from "@/dto/NoteDTO";
import { getNoteDataByPageID, updateNoteContent } from "@/services/NoteService";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import { useState } from "react";
import { deleteGeneralPage } from "@/services/GeneralPageService";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { useColorScheme } from "react-native";

export default function NotesScreen() {
  const { id, title } = useLocalSearchParams<{ id?: string; title?: string }>();
  const router = useRouter();
  const [noteContent, setNoteContent] = useState<string>("");
  const latestNoteContentRef = useRef<string>("");
  const colorScheme = useColorScheme();

  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  useEffect(() => {
    if (id) {
      const numericID = Number(id);
      if (!isNaN(numericID)) {
        (async () => {
          const noteData: NoteDTO | null = await getNoteDataByPageID(numericID);
          let noteContent = noteData?.note_content;
          if (noteContent == null) {
            noteContent = "";
          }
          setNoteContent(noteContent);
        })();
      } else {
        console.error("Error fetching note data");
      }
    }
  }, [id, colorScheme]);

  const saveNote = async (html: string) => {
    if (!id) return;
    const success = await updateNoteContent(Number(id), html);
    console.log("Saved note: ", success);
  };

  const debouncedSave = useDebouncedCallback(saveNote, 1000);
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.match(/active/) &&
        nextAppState.match(/inactive|background/)
      ) {
        debouncedSave.flush(latestNoteContentRef.current);
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, [appState, noteContent, debouncedSave]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#111111" }}>
        <CustomStyledHeader
          title={title || "Note"}
          iconName="more-horiz"
          backBehavior="goHome"
          onIconPress={() => setShowDeleteModal(true)}
          otherBackBehavior={() =>
            debouncedSave.flush(latestNoteContentRef.current)
          }
        />
        <TextEditor
          initialContent={noteContent}
          onChange={(html) => {
            latestNoteContentRef.current = html;
            debouncedSave.debouncedFunction(html);
          }}
        />
      </SafeAreaView>
      <DeleteModal
        visible={showDeleteModal}
        title={title}
        typeToDelete="note"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (id) {
            try {
              const widgetIdAsNumber = Number(id);
              const successfullyDeleted =
                await deleteGeneralPage(widgetIdAsNumber);
              setShowDeleteModal(false);
              router.replace("/");
            } catch (error) {
              console.error("Error deleting note:", error);
            }
          }
        }}
        onclose={() => setShowDeleteModal(false)}
      />
    </>
  );
}
