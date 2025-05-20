import TextEditor from "@/components/TextEditor/TextEditor";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppState, AppStateStatus, View } from "react-native";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { NoteDTO } from "@/shared/dto/NoteDTO";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import { useState } from "react";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { useColorScheme } from "react-native";
import QuickActionModal from "@/components/Modals/QuickActionModal/QuickActionModal";
import { set } from "date-fns";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { noteService } from "@/backend/service/NoteService";
import { generalPageService } from "@/backend/service/GeneralPageService";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";

export default function NotesScreen() {
  const { pageId, title, routing } = useLocalSearchParams<{
    pageId?: string;
    title?: string;
    routing?: string;
  }>();
  const router = useRouter();
  const [noteContent, setNoteContent] = useState<string>("");
  const latestNoteContentRef = useRef<string>("");
  const colorScheme = useColorScheme();
  const [showModal, setShowModal] = useState(false);
  const [noteData, setNoteData] = useState<NoteDTO | null>();
  const [shouldReload, setShouldReload] = useState<boolean>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  useEffect(() => {
    if (pageId) {
      const numericID = Number(pageId);
      if (!isNaN(numericID)) {
        (async () => {
          const noteDataByID: NoteDTO | null =
            await noteService.getNoteDataByPageID(numericID);
          let noteContent = noteData?.note_content;
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
    const success = await noteService.updateNoteContent(Number(pageId), html);
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

  const goToEditPage = () => {
    const path = "/editWidget";

    router.push({
      pathname: path,
      params: { widgetID: pageId },
    });
  };

  const { showSnackbar } = useSnackbar();

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#111111" }}>
        <CustomStyledHeader
          title={title || "Note"}
          iconName="more-horiz"
          backBehavior={routing}
          onIconPress={() => setShowModal(true)}
          otherBackBehavior={() =>
            debouncedSave.flush(latestNoteContentRef.current)
          }
          leftIconName={
            noteData?.page_icon as keyof typeof MaterialIcons.glyphMap
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
            label: noteData?.pinned ? "Unpin Widget" : "Pin Widget",
            icon: "push-pin",
            disabled:
              noteData?.pinned === false &&
              noteData?.pin_count != null &&
              noteData.pin_count >= 4,
            onPress: async () => {
              if (
                (noteData &&
                  !noteData.pinned &&
                  noteData.pin_count != null &&
                  noteData.pin_count < 4) ||
                (noteData && noteData?.pinned)
              ) {
                const success = await generalPageService.togglePagePin(
                  Number(pageId),
                  noteData.pinned,
                );
                setShouldReload(success);
              }
            },
          },
          {
            label: "Edit",
            icon: "edit",
            onPress: () => {
              goToEditPage();
            },
          },
          {
            label: noteData?.archived ? "Restore" : "Archive",
            icon: noteData?.archived ? "restore" : "archive",
            onPress: async () => {
              if (noteData) {
                const success = await generalPageService.togglePageArchive(
                  Number(pageId),
                  noteData.archived,
                );
                if (success) {
                  showSnackbar(
                    noteData.archived
                      ? "Successfully restored Note."
                      : "Successfully archived Note.",
                    "bottom",
                    "success",
                  );
                } else {
                  showSnackbar(
                    noteData.archived
                      ? "Failed to restore Note."
                      : "Failed to archive Note.",
                    "bottom",
                    "error",
                  );
                }
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
                await generalPageService.deleteGeneralPage(widgetIdAsNumber);
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
