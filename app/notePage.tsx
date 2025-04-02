import TextEditor from "@/components/TextEditor/TextEditor";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";

export default function NotesScreen() {
  return (
    <>
      <ThemedView style={{ flex: 1 }}>
        <ThemedText fontSize="xl" fontWeight="bold">
          Note
        </ThemedText>
        <TextEditor />
      </ThemedView>
    </>
  );
}
