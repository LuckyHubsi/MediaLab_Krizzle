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
import DeleteModal from "@/components/ui/DeleteModal/DeleteModal";
import { useState } from "react";
import { deleteGeneralPage } from "@/services/GeneralPageService";

export default function NotesScreen() {
  const { id, title } = useLocalSearchParams<{ id?: string; title?: string }>();
  const router = useRouter();

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

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#111111" }}>
        <CustomStyledHeader
          title={title || "Note"}
          iconName="more-horiz"
          backBehavior="goHome"
          onIconPress={() => setShowDeleteModal(true)}
        />
        <TextEditor />
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
              router.navigate("/");
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
