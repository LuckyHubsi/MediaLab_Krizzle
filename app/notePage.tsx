import TextEditor from "@/components/TextEditor/TextEditor";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";

export default function NotesScreen() {
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomStyledHeader title="Title" onIconPress={() => alert("Popup!")} />
        <ThemedView>
          <TextEditor />
        </ThemedView>
      </SafeAreaView>
    </>
  );
}
