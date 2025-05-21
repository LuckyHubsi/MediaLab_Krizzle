import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import CreateCollection, {
  CollectionData,
} from "@/components/ui/CreateCollectionSteps/CreateCollection/CreateCollection";
import CreateCollectionList from "@/components/ui/CreateCollectionSteps/CreateCollectionList/CreateCollectionList";
import CreateCollectionTemplate from "@/components/ui/CreateCollectionSteps/CreateCollectionTemplate/CreateCollectionTemplate";
import { router } from "expo-router";
import { CollectionDTO } from "@/shared/dto/CollectionDTO";
import { ItemTemplateDTO } from "@/shared/dto/ItemTemplateDTO";
import { CollectionCategoryDTO } from "@/shared/dto/CollectionCategoryDTO";
import { AttributeDTO } from "@/shared/dto/AttributeDTO";
import { GradientBackground } from "@/components/ui/GradientBackground/GradientBackground";
import { Platform } from "react-native";
import { collectionService } from "@/backend/service/CollectionService";
import { PageType } from "@/shared/enum/PageType";
import { AttributeType } from "@/shared/enum/AttributeType";

export default function CollectionTemplateScreen() {
  const [step, setStep] = useState<"create" | "list" | "template">("create");

  const [collectionData, setCollectionData] = useState<CollectionData>({
    title: "",
    selectedTag: null,
    selectedColor: "#4599E8",
    selectedIcon: undefined,
    lists: [],
    templates: [],
  });

  const prepareDTOs = (): {
    collection: CollectionDTO;
    template: ItemTemplateDTO;
  } => {
    const lists: CollectionCategoryDTO[] = collectionData.lists.map((list) => {
      return { category_name: list.title };
    });

    const collection: CollectionDTO = {
      page_title: collectionData.title,
      page_type: PageType.Collection,
      page_icon: collectionData.selectedIcon,
      page_color: collectionData.selectedColor,
      archived: false,
      pinned: false,
      categories: lists,
      tag: collectionData.selectedTag,
      pin_count: 0,
    };

    const attributes: AttributeDTO[] = collectionData.templates.map(
      (attribute) => {
        return {
          attributeLabel: attribute.title ?? "",
          type: attribute.itemType as AttributeType,
          preview: attribute.isPreview,
          options: attribute.options,
          symbol: attribute.rating,
        };
      },
    );

    const template: ItemTemplateDTO = {
      template_name: `${collectionData.title} template`,
      attributes: attributes,
    };

    return { collection, template };
  };

  const createCollection = async () => {
    const dtos: { collection: CollectionDTO; template: ItemTemplateDTO } =
      prepareDTOs();
    const pageId = await collectionService.saveCollection(
      dtos.collection,
      dtos.template,
    );
    router.replace({
      pathname: "/collectionPage",
      params: { pageId: pageId, title: collectionData.title },
    });
  };

  return (
    <GradientBackground
      backgroundCardTopOffset={Platform.select({ ios: 100, android: 95 })}
      topPadding={Platform.select({ ios: 0, android: 15 })}
    >
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
          onNext={createCollection}
        />
      )}
    </GradientBackground>
  );
}
