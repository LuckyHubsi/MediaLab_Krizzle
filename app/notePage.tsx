import TextEditor from "@/components/TextEditor/TextEditor";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AccessibilityInfo,
  AppState,
  AppStateStatus,
  findNodeHandle,
  Platform,
  View,
} from "react-native";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { NoteDTO } from "@/shared/dto/NoteDTO";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import { useState } from "react";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import QuickActionModal, {
  QuickActionItem,
} from "@/components/Modals/QuickActionModal/QuickActionModal";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";
import { useServices } from "@/context/ServiceContext";
import SelectFolderModal from "@/components/ui/SelectFolderModal/SelectFolderModal";
import { EnrichedError } from "@/shared/error/ServiceError";
import { ErrorPopup } from "@/components/Modals/ErrorModal/ErrorModal";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useActiveColorScheme } from "@/context/ThemeContext";

/**
 * NotesScreen screen that displays a note with rich text editing capabilities.
 *
 * @params pageId - The ID of the note to display.
 * @params title - The title of the note.
 * @params routing - The routing behavior for the back button.
 */
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
  const colorScheme = useActiveColorScheme();
  const [showModal, setShowModal] = useState(false);
  const [noteData, setNoteData] = useState<NoteDTO | null>();
  const [shouldReload, setShouldReload] = useState<boolean>();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFolderSelectionModal, setShowFolderSelectionModal] =
    useState(false);
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );
  const [errors, setErrors] = useState<EnrichedError[]>([]);
  const [showError, setShowError] = useState(false);
  const { showSnackbar } = useSnackbar();
  const headerRef = useRef<View | null>(null);

  /**
   * sets the screenreader focus to the header after mount
   */
  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(() => {
        const node = findNodeHandle(headerRef.current);
        if (node) {
          AccessibilityInfo.setAccessibilityFocus(node);
        }
      }, 100);

      return () => clearTimeout(timeout);
    }, []),
  );

  /**
   * Fetches the note data by page ID when the component mounts or when the pageId changes.
   */
  useEffect(() => {
    if (pageId) {
      const numericID = Number(pageId);
      if (!isNaN(numericID)) {
        (async () => {
          const noteResult = await noteService.getNoteDataByPageID(numericID);
          let noteContent = noteData?.note_content;
          if (noteContent == null) {
            noteContent = "";
          }
          if (noteResult.success) {
            setNoteContent(noteContent);
            setNoteData(noteResult.value);
            setShouldReload(false);

            // remove all prior errors from the note retrieval source if service call succeeded
            setErrors((prev) =>
              prev.filter((error) => error.source !== "note:retrieval"),
            );
          } else {
            // set all errors to the previous errors plus add the new error
            // define the id and the source and set its read status to false
            setErrors((prev) => [
              ...prev,
              {
                ...noteResult.error,
                hasBeenRead: false,
                id: `${Date.now()}-${Math.random()}`,
                source: "note:retrieval",
              },
            ]);
            setShowError(true);
          }
        })();
      } else {
        console.error("Error fetching note data");
      }
    }
  }, [pageId, shouldReload, colorScheme]);

  /**
   * Saves the note content to the server when the content changes.
   */
  const saveNote = async (html: string) => {
    if (!pageId) return;
    const updateResult = await noteService.updateNoteContent(
      Number(pageId),
      html,
    );
    if (updateResult.success) {
      // remove all prior errors from the note update source if service call succeeded
      setErrors((prev) =>
        prev.filter((error) => error.source !== "note:update"),
      );
    } else {
      // set all errors to the previous errors plus add the new error
      // define the id and the source and set its read status to false
      setErrors((prev) => [
        ...prev,
        {
          ...updateResult.error,
          hasBeenRead: false,
          id: `${Date.now()}-${Math.random()}`,
          source: "note:update",
        },
      ]);
      setShowError(true);
    }
  };

  /**
   * Debounced save function that saves the note content after a delay of 1000ms.
   */
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

  /**
   * Components used:
   *
   * - CustomStyledHeader: A custom header component with a title and actions.
   * - TextEditor: A rich text editor for editing the note content.
   * - QuickActionModal: A modal for quick actions on the note.
   * - DeleteModal: A modal for confirming deletion of the note.
   * - SelectFolderModal: A modal for selecting a folder to move the note.
   * - ErrorPopup: A modal for displaying errors.
   */
  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors[colorScheme ?? "light"].background,
        }}
      >
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
          headerRef={headerRef}
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
                      const pinResult = await generalPageService.togglePagePin(
                        Number(pageId),
                        noteData.pinned,
                      );
                      if (pinResult.success) {
                        setShouldReload(true);

                        // remove all prior errors from the pinning source if service call succeeded
                        setErrors((prev) =>
                          prev.filter((error) => error.source !== "pinning"),
                        );
                      } else {
                        // set all errors to the previous errors plus add the new error
                        // define the id and the source and set its read status to false
                        setErrors((prev) => [
                          ...prev,
                          {
                            ...pinResult.error,
                            hasBeenRead: false,
                            id: `${Date.now()}-${Math.random()}`,
                            source: "pinning",
                          },
                        ]);
                        setShowError(true);
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
                  const archiveResult =
                    await generalPageService.togglePageArchive(
                      Number(pageId),
                      noteData.archived,
                    );
                  if (archiveResult.success) {
                    showSnackbar(
                      noteData.archived
                        ? "Successfully restored Note."
                        : "Successfully moved Note to Archive in Menu.",
                      "bottom",
                      "success",
                    );
                    setShouldReload(true);

                    // remove all prior errors from the archiving source if service call succeeded
                    setErrors((prev) =>
                      prev.filter((error) => error.source !== "archiving"),
                    );
                  } else {
                    // set all errors to the previous errors plus add the new error
                    // define the id and the source and set its read status to false
                    setErrors((prev) => [
                      ...prev,
                      {
                        ...archiveResult.error,
                        hasBeenRead: false,
                        id: `${Date.now()}-${Math.random()}`,
                        source: "archiving",
                      },
                    ]);
                    setShowError(true);
                    showSnackbar(
                      noteData.archived
                        ? "Failed to restore Note."
                        : "Failed to move Note to Archive in Menu.",
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
              const deleteResult =
                await generalPageService.deleteGeneralPage(widgetIdAsNumber);
              if (deleteResult.success) {
                setShowDeleteModal(false);

                // remove all prior errors from the widget delete source if service call succeeded
                setErrors((prev) =>
                  prev.filter((error) => error.source !== "widget:delete"),
                );
                router.replace("/");
              } else {
                // set all errors to the previous errors plus add the new error
                // define the id and the source and set its read status to false
                setErrors((prev) => [
                  ...prev,
                  {
                    ...deleteResult.error,
                    hasBeenRead: false,
                    id: `${Date.now()}-${Math.random()}`,
                    source: "widget:delete",
                  },
                ]);
                setShowError(true);
                setShowDeleteModal(false);
              }
            } catch (error) {
              console.error("Error deleting note:", error);
            }
          }
        }}
        onClose={() => setShowDeleteModal(false)}
      />

      <SelectFolderModal
        widgetTitle={title}
        widgetId={pageId}
        initialSelectedFolderId={
          noteData?.parentID ? noteData.parentID : undefined
        }
        onClose={() => setShowFolderSelectionModal(false)}
        visible={showFolderSelectionModal}
        onMoved={(success: boolean) => {
          if (success) {
            showSnackbar(
              "Note moved to folder successfully",
              "bottom",
              "success",
            );
            setShouldReload(true);
          } else {
            showSnackbar("Failed to move note to folder.", "bottom", "error");
          }
          setShowFolderSelectionModal(false);
        }}
      />

      <ErrorPopup
        visible={showError && errors.some((e) => !e.hasBeenRead)}
        errors={errors.filter((e) => !e.hasBeenRead) || []}
        onClose={(updatedErrors) => {
          const updatedIds = updatedErrors.map((e) => e.id);
          const newCombined = errors.map((e) =>
            updatedIds.includes(e.id) ? { ...e, hasBeenRead: true } : e,
          );
          setErrors(newCombined);
          setShowError(false);
        }}
      />
    </>
  );
}
