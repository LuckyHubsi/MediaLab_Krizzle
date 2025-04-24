import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/ui/Header/Header";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { View } from "react-native";
import BottomButtons from "@/components/ui/BottomButtons/BottomButtons";
import AddCollectionItemCard from "@/components/ui/AddCollectionItemCard/AddCollectionItemCard";

export default function AddCollectionItem() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Header
            title="Add Collection Item"
            onIconPress={() => alert("Popup!")}
          />

          <AddCollectionItemCard />

          {/* add correct function to discard/next */}
          <BottomButtons
            titleLeftButton={"Discard"}
            titleRightButton={"Add"}
            variant="discard"
            onDiscard={function (): void {}}
            onNext={function (): void {}}
          ></BottomButtons>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
