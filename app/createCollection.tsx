import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import CreateCollection from "@/components/ui/CreateCollectionSteps/CreateCollection/CreateCollection";
import CreateCollectionList from "@/components/ui/CreateCollectionSteps/CreateCollectionList/CreateCollectionList";
import CreateCollectionTemplate from "@/components/ui/CreateCollectionSteps/CreateCollectionTemplate/CreateCollectionTemplate";
import { router } from "expo-router";

export default function CollectionTemplateScreen() {
  const [step, setStep] = useState<"create" | "list" | "template">("create");

  const [collectionData, setCollectionData] = useState<CollectionData>({
    title: "",
    selectedTag: null,
    selectedColor: "",
    selectedIcon: undefined,
    lists: [],
    templates: [],
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        {step === "create" && (
          <CreateCollection
            data={collectionData}
            setData={setCollectionData}
            onNext={() => setStep("list")}
          />
        )}
        {step === "list" && (
          <CreateCollectionList
            data={collectionData}
            setData={setCollectionData}
            onBack={() => setStep("create")}
            onNext={() => setStep("template")}
          />
        )}
        {step === "template" && (
          <CreateCollectionTemplate
            data={collectionData}
            setData={setCollectionData}
            onBack={() => setStep("list")}
            onNext={() => router.push("/collectionPage")}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}
