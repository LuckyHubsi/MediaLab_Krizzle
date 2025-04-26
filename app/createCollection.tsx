import CreateCollection from "@/components/ui/CreateCollectionSteps/CreateCollection/CreateCollection";
import CreateCollectionList from "@/components/ui/CreateCollectionSteps/CreateCollectionList/CreateCollectionList";
import CreateCollectionTemplate from "@/components/ui/CreateCollectionSteps/CreateCollectionTemplate/CreateCollectionTemplate";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CollectionTemplateScreen() {
  const [step, setStep] = useState<"create" | "list" | "template">("create");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        {step === "create" && (
          <CreateCollection onNext={() => setStep("list")} />
        )}
        {step === "list" && (
          <CreateCollectionList
            onBack={() => setStep("create")}
            onNext={() => setStep("template")}
          />
        )}
        {step === "template" && (
          <CreateCollectionTemplate
            onBack={() => setStep("list")}
            // onNext={() => setStep("template")}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}
