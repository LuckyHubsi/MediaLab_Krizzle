import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import CreateCollection, {
  CollectionData,
} from "@/components/ui/CreateCollectionSteps/CreateCollection/CreateCollection";
import CreateCollectionTemplate from "@/components/ui/CreateCollectionSteps/CreateCollectionTemplate/CreateCollectionTemplate";
import { router } from "expo-router";
import { CollectionDTO } from "@/shared/dto/CollectionDTO";
import { ItemTemplateDTO } from "@/shared/dto/ItemTemplateDTO";
import { CollectionCategoryDTO } from "@/shared/dto/CollectionCategoryDTO";
import { AttributeDTO } from "@/shared/dto/AttributeDTO";
import { GradientBackground } from "@/components/ui/GradientBackground/GradientBackground";
import { Platform } from "react-native";
import { PageType } from "@/shared/enum/PageType";
import { AttributeType } from "@/shared/enum/AttributeType";
import { useServices } from "@/context/ServiceContext";
import { Colors } from "@/constants/Colors";
import { EnrichedError } from "@/shared/error/ServiceError";
import { ErrorPopup } from "@/components/Modals/ErrorModal/ErrorModal";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";

/**
 * CollectionTemplateScreen is a screen that allows users to create a new collection
 * (Step 1: Create Widget, Step 2: Create Template).
 */

export default function CollectionTemplateScreen() {
  const { collectionService } = useServices();

  const [step, setStep] = useState<"create" | "template">("create");

  const [errors, setErrors] = useState<EnrichedError[]>([]);
  const [showError, setShowError] = useState(false);

  const { showSnackbar } = useSnackbar();

  // Initial state for collection data
  const [collectionData, setCollectionData] = useState<CollectionData>({
    title: "",
    selectedTag: null,
    selectedColor: Colors.primary,
    selectedIcon: undefined,
    lists: [],
    templates: [],
  });

  // Function to prepare DTOs for collection and template creation
  // This function maps the collection data to the DTOs required by the service
  const prepareDTOs = (): {
    collection: CollectionDTO;
    template: ItemTemplateDTO;
  } => {
    const collection: CollectionDTO = {
      page_title: collectionData.title,
      page_type: PageType.Collection,
      page_icon: collectionData.selectedIcon,
      page_color: collectionData.selectedColor,
      archived: false,
      pinned: false,
      categories: [],
      tag: collectionData.selectedTag,
      pin_count: 0,
      parentID: null, // TODO - pass the correct folderID if screen accessed from a folder page
    };

    /**
     * Maps template data into an array of AttributeDTO objects.
     * Extracts and formats fields like label, type, preview, options, and symbol from each template.
     */
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
      template_name: `${collectionData.title}`,
      attributes: attributes,
    };

    return { collection, template };
  };

  // Function to create a new collection
  const createCollection = async () => {
    const dtos: { collection: CollectionDTO; template: ItemTemplateDTO } =
      prepareDTOs();
    const collectionIDResult = await collectionService.saveCollection(
      dtos.collection,
      dtos.template,
    );
    if (collectionIDResult.success) {
      // remove all prior errors from the collection insert source if service call succeeded
      setErrors((prev) =>
        prev.filter((error) => error.source !== "collection:insert"),
      );

      router.replace({
        pathname: "/collectionPage",
        params: {
          pageId: collectionIDResult.value,
          title: collectionData.title,
        },
      });

      showSnackbar(
        `Successfully created Collection: "${collectionData.title}". `,
        "bottom",
        "success",
      );
    } else {
      // set all errors to the previous errors plus add the new error
      // define the id and the source and set its read status to false
      setErrors((prev) => [
        ...prev,
        {
          ...collectionIDResult.error,
          hasBeenRead: false,
          id: `${Date.now()}-${Math.random()}`,
          source: "collection:insert",
        },
      ]);
      setShowError(true);
      showSnackbar(
        `Failed to create Collection: "${collectionData.title}". `,
        "bottom",
        "error",
      );
    }
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
          onNext={() => setStep("template")}
        />
      )}
      {step === "template" && (
        <CreateCollectionTemplate
          data={collectionData}
          setData={setCollectionData}
          onBack={() => setStep("create")}
          onNext={createCollection}
        />
      )}

      <ErrorPopup
        visible={showError && errors.some((e) => !e.hasBeenRead)}
        errors={errors.filter((e) => !e.hasBeenRead) || []}
        onClose={(updatedErrors) => {
          // all current errors get tagged as hasBeenRead true on close of the modal (dimiss or click outside)
          const updatedIds = updatedErrors.map((e) => e.id);
          const newCombined = errors.map((e) =>
            updatedIds.includes(e.id) ? { ...e, hasBeenRead: true } : e,
          );
          setErrors(newCombined);
          setShowError(false);
        }}
      />
    </GradientBackground>
  );
}
