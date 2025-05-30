import TextEditor from "@/components/TextEditor/TextEditor";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppState, AppStateStatus, Platform, View } from "react-native";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { NoteDTO } from "@/shared/dto/NoteDTO";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import { useState } from "react";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { useColorScheme } from "react-native";
import QuickActionModal, {
  QuickActionItem,
} from "@/components/Modals/QuickActionModal/QuickActionModal";
import { set } from "date-fns";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";
import { useServices } from "@/context/ServiceContext";
import SelectFolderModal from "@/components/ui/SelectFolderModal/SelectFolderModal";

export default function NotesScreen() {
  const { pageId, title, routing } = useLocalSearchParams<{
    pageId?: string;
    title?: string;
    routing?: string;
  }>();
  const { generalPageService, noteService } = useServices();

  const router = useRouter();
  const [noteContent, setNoteContent] = useState<string>("");
  const latestNoteContentRef = useRef<string>("");
  const colorScheme = useColorScheme();
  const [showModal, setShowModal] = useState(false);
  const [noteData, setNoteData] = useState<NoteDTO | null>();
  const [shouldReload, setShouldReload] = useState<boolean>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFolderSelectionModal, setShowFolderSelectionModal] =
    useState(false);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );

  useEffect(() => {
    if (pageId) {
      const numericID = Number(pageId);
      if (!isNaN(numericID)) {
        (async () => {
          const result = await noteService.getNoteDataByPageID(numericID);
          let noteContent = noteData?.note_content;
          if (noteContent == null) {
            noteContent = "";
          }
          if (result.success) {
            setNoteContent(noteContent);
            setNoteData(result.value);
            setShouldReload(false);
          } else {
            // TODO: show error modal
          }
        })();
      } else {
        console.error("Error fetching note data");
      }
    }
  }, [pageId, shouldReload, colorScheme]);

  const saveNote = async (html: string) => {
    if (!pageId) return;
    const result = await noteService.updateNoteContent(Number(pageId), html);
    if (!result.success) {
      // TODO: show error modal
    }
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
        items={
          [
            noteData && !noteData.archived
              ? {
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
                      const result = await generalPageService.togglePagePin(
                        Number(pageId),
                        noteData.pinned,
                      );
                      if (result.success) {
                        setShouldReload(true);
                      } else {
                        // TODO: show error modal
                      }
                    }
                  },
                }
              : null,
            noteData && !noteData.archived
              ? {
                  label: "Edit Widget",
                  icon: "edit",
                  onPress: () => {
                    goToEditPage();
                  },
                }
              : null,
            {
              label: noteData?.archived ? "Restore" : "Archive",
              icon: noteData?.archived ? "restore" : "archive",
              onPress: async () => {
                if (noteData) {
                  const result = await generalPageService.togglePageArchive(
                    Number(pageId),
                    noteData.archived,
                  );
                  if (result.success) {
                    showSnackbar(
                      noteData.archived
                        ? "Successfully restored Note."
                        : "Successfully moved Note to Archive in Settings.",
                      "bottom",
                      "success",
                    );
                    setShouldReload(true);
                  } else {
                    // TODO: show error modal
                    showSnackbar(
                      noteData.archived
                        ? "Failed to restore Note."
                        : "Failed to move Note to Archive in Settings.",
                      "bottom",
                      "error",
                    );
                  }
                }
              },
            },
            noteData && !noteData.archived
              ? {
                  label: "Move to Folder",
                  icon: "folder",
                  onPress: async () => {
                    setShowFolderSelectionModal(true);
                  },
                }
              : null,
            {
              label: "Delete",
              icon: "delete",
              onPress: () => {
                setShowDeleteModal(true);
              },
              danger: true,
            },
          ].filter(Boolean) as QuickActionItem[]
        }
      />
      <DeleteModal
        visible={showDeleteModal}
        title={title}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (pageId) {
            try {
              const widgetIdAsNumber = Number(pageId);
              const result =
                await generalPageService.deleteGeneralPage(widgetIdAsNumber);
              if (result.success) {
                setShowDeleteModal(false);

                router.replace("/");
              } else {
                // TODO: show error modal
              }
            } catch (error) {
              console.error("Error deleting note:", error);
            }
          }
        }}
        onclose={() => setShowDeleteModal(false)}
      />

      <SelectFolderModal
        widgetTitle={title}
        onClose={() => setShowFolderSelectionModal(false)}
        visible={showFolderSelectionModal}
      />
    </>
  );
}
