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
import {
  deleteGeneralPage,
  togglePageArchive,
  togglePagePin,
} from "@/services/GeneralPageService";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { useColorScheme } from "react-native";
import QuickActionModal from "@/components/Modals/QuickActionModal/QuickActionModal";
import { set } from "date-fns";

export default function NotesScreen() {
  const { pageId, title } = useLocalSearchParams<{
    pageId?: string;
    title?: string;
  }>();
  const router = useRouter();
  const [noteContent, setNoteContent] = useState<string>("");
  const latestNoteContentRef = useRef<string>("");
  const colorScheme = useColorScheme();
  const [showModal, setShowModal] = useState(false);
  const [noteData, setNoteData] = useState<NoteDTO | null>();
  const [shouldReload, setShouldReload] = useState<boolean>();

  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  useEffect(() => {
    if (pageId) {
      const numericID = Number(pageId);
      if (!isNaN(numericID)) {
        (async () => {
          const noteDataByID: NoteDTO | null =
            await getNoteDataByPageID(numericID);
          let noteContent = noteDataByID?.note_content;
          if (noteContent == null) {
            noteContent = "";
          }
          setNoteContent(noteContent);
          setNoteData(noteDataByID);
          setShouldReload(false);
        })();
      } else {
        console.error("Error fetching note data");
      }
    }
  }, [pageId, shouldReload, colorScheme]);

  const saveNote = async (html: string) => {
    if (!pageId) return;
    const success = await updateNoteContent(Number(pageId), html);
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
          onIconPress={() => setShowModal(true)}
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
      <QuickActionModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        items={[
          {
            label: noteData?.pinned ? "Unpin item" : "Pin item",
            icon: "push-pin",
            onPress: async () => {
              if (
                (noteData &&
                  !noteData.pinned &&
                  noteData.pin_count != null &&
                  noteData.pin_count < 4) ||
                (noteData && noteData?.pinned)
              ) {
                const success = await togglePagePin(
                  Number(pageId),
                  noteData.pinned,
                );
                setShouldReload(success);
              }
            },
          },
          { label: "Edit", icon: "edit", onPress: () => {} },
          {
            label: noteData?.archived ? "Restore" : "Archive",
            icon: noteData?.archived ? "restore" : "archive",
            onPress: async () => {
              if (noteData) {
                const success = await togglePageArchive(
                  Number(pageId),
                  noteData.archived,
                );
                setShouldReload(success);
              }
            },
          },
          {
            label: "Delete",
            icon: "delete",
            onPress: () => {
              setShowDeleteModal(true);
            },
            danger: true,
          },
        ]}
      />
      <DeleteModal
        visible={showDeleteModal}
        title={title}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (pageId) {
            try {
              const widgetIdAsNumber = Number(pageId);
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
