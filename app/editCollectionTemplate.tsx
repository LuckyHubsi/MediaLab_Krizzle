import React, { useEffect, useState } from "react";
import {
  View,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useServices } from "@/context/ServiceContext";
import { AttributeDTO } from "@/shared/dto/AttributeDTO";
import { AttributeType } from "@/shared/enum/AttributeType";
import { ThemedText } from "@/components/ThemedText";
import BottomButtons from "@/components/ui/BottomButtons/BottomButtons";
import ItemTemplateCard from "@/components/ui/CreateCollectionSteps/CreateCollectionTemplate/ItemTemplateCard/ItemTemplateCard";
import { Card } from "@/components/ui/Card/Card";
import { IconTopRight } from "@/components/ui/IconTopRight/IconTopRight";
import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";
import { InfoPopup } from "@/components/Modals/InfoModal/InfoModal";
import { AddButton } from "@/components/ui/AddButton/AddButton";
import {
  CardHeader,
  CardText,
  ItemCount,
  ItemCountContainer,
} from "@/components/ui/CreateCollectionSteps/CreateCollectionTemplate/CreateCollectionTemplate.styles";
import { Header } from "@/components/ui/Header/Header";
import { GradientBackground } from "@/components/ui/GradientBackground/GradientBackground";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import { EnrichedError } from "@/shared/error/ServiceError";
import { ErrorPopup } from "@/components/Modals/ErrorModal/ErrorModal";

/**
 * Screen for editing a collection template.
 */
export default function EditCollectionTemplateScreen() {
  const { collectionService, itemTemplateService } = useServices();
  const router = useRouter();
  const colorScheme = useActiveColorScheme();
  const { showSnackbar } = useSnackbar();
  const { pageId, templateId } = useLocalSearchParams<{
    pageId: string;
    templateId: string;
  }>();
  const [title, setTitle] = useState("");
  const [templates, setTemplates] = useState<
    (AttributeDTO & { isExisting?: boolean })[]
  >([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [attributeToDelete, setAttributeToDelete] =
    useState<AttributeDTO | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [hasClickedNext, setHasClickedNext] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const cards = templates;
  const otherCards = cards.slice(1);
  const previewCount = templates.filter((card) => card.preview).length;
  const [errors, setErrors] = useState<EnrichedError[]>([]);
  const [showError, setShowError] = useState(false);
  const [cardHeight, setCardHeight] = useState(0);

  // Calculate screen dimensions and orientation
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const screenSize = isLandscape ? width : height;
  const isHighCard = cardHeight > height * 0.3;
  const isSmallScreen = screenSize < (isLandscape ? 1500 : 600);
  /**
   * Effect to handle keyboard visibility on Android.
   */
  useEffect(() => {
    if (Platform.OS === "android") {
      const showSub = Keyboard.addListener("keyboardDidShow", () =>
        setKeyboardVisible(true),
      );
      const hideSub = Keyboard.addListener("keyboardDidHide", () =>
        setKeyboardVisible(false),
      );
      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }
  }, []);

  /**
   * Effect to load collection and template data when the component mounts.
   */
  useEffect(() => {
    const loadData = async () => {
      const collectionResult = await collectionService.getCollectionByPageId(
        Number(pageId),
      );
      const templateResult = await itemTemplateService.getTemplate(
        Number(templateId),
      );

      if (collectionResult.success && templateResult.success) {
        setTitle(collectionResult.value.page_title);

        const updated = [...(templateResult.value.attributes ?? [])].map(
          (attr, index) => ({
            ...attr,
            isExisting: true,
            type: index === 0 ? AttributeType.Text : attr.type,
            preview: index === 0 ? true : attr.preview,
          }),
        );

        setTemplates(updated);

        // remove all errors from both the collection and template retrieval source
        setErrors((prev) =>
          prev.filter(
            (error) =>
              error.source !== "collection:retrieval" || "template:retrieval",
          ),
        );
      }
      if (!collectionResult.success) {
        // set all errors to the previous errors plus add the new error
        // define the id and the source and set its read status to false
        setErrors((prev) => [
          ...prev,
          {
            ...collectionResult.error,
            hasBeenRead: false,
            id: `${Date.now()}-${Math.random()}`,
            source: "collection:retrieval",
          },
        ]);
        setShowError(true);
      }
      if (!templateResult.success) {
        setErrors((prev) => [
          ...prev,
          {
            ...templateResult.error,
            hasBeenRead: false,
            id: `${Date.now()}-${Math.random()}`,
            source: "template:retrieval",
          },
        ]);
        setShowError(true);
      }
    };

    loadData();
  }, []);

  /**
   * Handles changes to the title of a template card.
   */
  const handleTitleChange = (id: number, text: string) => {
    setTemplates((prev) =>
      prev.map((card) =>
        card.attributeID === id ? { ...card, attributeLabel: text } : card,
      ),
    );
  };

  /**
   * Handles changes to the type of a template card.
   */
  const handleTypeChange = (id: number, newType: string) => {
    setTemplates((prev) =>
      prev.map((card, index) =>
        card.attributeID === id && index !== 0
          ? { ...card, type: newType as AttributeType }
          : card,
      ),
    );
  };

  /**
   * Handles changes to the rating (icon) of a template card.
   */
  const handleRatingChange = (
    id: number,
    rating: keyof typeof MaterialIcons.glyphMap,
  ) => {
    setTemplates((prev) =>
      prev.map((card) =>
        card.attributeID === id ? { ...card, symbol: rating } : card,
      ),
    );
  };

  /**
   * Handles changes to the options of a multi-select template card.
   */
  const handleOptionsChange = (id: number, options: string[]) => {
    setTemplates((prev) =>
      prev.map((card) =>
        card.attributeID === id ? { ...card, options } : card,
      ),
    );
  };

  /**
   * Handles the removal of a template card.
   */
  const handleRemoveCard = async (id: number) => {
    if (templates.length <= 1) {
      showSnackbar("You must have at least one field.", "top", "error");
      return;
    }

    const item = templates.find((l) => l.attributeID === id);
    if (item) {
      setAttributeToDelete(item);
      setShowDeleteModal(true);
    }
  };

  /**
   * Confirms the deletion of a template card.
   */
  const confirmDelete = async () => {
    if (!attributeToDelete) return;

    const id = attributeToDelete.attributeID;

    if (!isNaN(Number(id))) {
      try {
        const deleteResult = await itemTemplateService.deleteAttribute(
          Number(id),
          Number(pageId),
        );

        if (deleteResult.success) {
          setTemplates((prev) =>
            prev.filter((card) => card.attributeID !== id),
          );

          // remove all prior errors from the attribute delete source if service call succeeded
          setErrors((prev) =>
            prev.filter((error) => error.source !== "attribute:delete"),
          );
        } else {
          // set all errors to the previous errors plus add the new error
          // define the id and the source and set its read status to false
          setErrors((prev) => [
            ...prev,
            {
              ...deleteResult.error,
              hasBeenRead: false,
              id: `${Date.now()}-${Math.random()}`,
              source: "attribute:delete",
            },
          ]);
          setShowError(true);
        }
      } catch (error) {
        console.error("Error deleting list:", error);
      }
    }

    setAttributeToDelete(null);
    setShowDeleteModal(false);
  };

  /**
   * Handles adding a new template card.
   */
  const handleAddCard = () => {
    if (templates.length >= 10) return;
    setTemplates((prev) => [
      ...prev,
      {
        attributeID: Date.now(), // temp ID
        attributeLabel: "",
        type: AttributeType.Text,
        preview: false,
        options: [],
        symbol: "star",
        isExisting: false,
      } as AttributeDTO,
    ]);
  };

  /**
   * Handles toggling the preview state of a template card.
   */
  const handlePreviewToggle = (id: number) => {
    setTemplates((prev) => {
      const toggledCard = prev.find((card) => card.attributeID === id);
      if (!toggledCard) return prev;

      const index = prev.findIndex((card) => card.attributeID === id);
      if (index === 0) {
        showSnackbar(
          "The first text field must always be in the preview.",
          "top",
          "error",
        );
        return prev;
      }

      const currentlySelected = prev.filter((c) => c.preview).length;
      const isCurrentlyPreviewed = toggledCard.preview ?? false;
      const togglingOn = !isCurrentlyPreviewed;

      if (togglingOn) {
        if (currentlySelected >= 3) {
          showSnackbar(
            "You can only preview up to 3 attributes.",
            "top",
            "error",
          );
          return prev;
        }

        let sameTypeAlreadyPreviewed = false;
        if (toggledCard.type === AttributeType.Text) {
          const textPreviewCount = prev.filter(
            (card) => card.preview && card.type === AttributeType.Text,
          ).length;
          if (textPreviewCount >= 2) {
            sameTypeAlreadyPreviewed = true;
          }
        } else {
          sameTypeAlreadyPreviewed = prev.some(
            (card) =>
              card.attributeID !== id &&
              card.preview === true &&
              card.type === toggledCard.type,
          );
        }

        if (sameTypeAlreadyPreviewed) {
          showSnackbar(
            "Only one preview is allowed per attribute type.",
            "top",
            "error",
          );
          return prev;
        }
      }

      return prev.map((card) =>
        card.attributeID === id ? { ...card, preview: togglingOn } : card,
      );
    });
  };

  /**
   * Handles saving the template changes.
   */
  const handleSave = async () => {
    setHasClickedNext(true);

    const allValid = templates.every((card) => {
      const hasTitle = !!card.attributeLabel?.trim();
      const hasOptions =
        card.type === "multi-select"
          ? Array.isArray(card.options) &&
            card.options.length > 0 &&
            card.options.every((o) => o.trim() !== "")
          : true;
      return hasTitle && hasOptions;
    });

    if (!allValid) {
      showSnackbar(
        "Make sure all templates have titles and valid options where needed.",
        "top",
        "error",
      );
      return;
    }

    const existingAttributes: AttributeDTO[] = templates.filter(
      (template) => template.isExisting === true,
    );

    const newAttributes: AttributeDTO[] = templates.filter(
      (template) => template.isExisting === false,
    );

    const updateResult = await itemTemplateService.updateTemplate(
      Number(templateId),
      existingAttributes,
      newAttributes,
      Number(pageId),
    );

    const hasMultiSelectDuplicates = templates.some((card) => {
      if (card.type !== "multi-select" || !card.options) return false;

      const trimmedLowercase = card.options
        .map((o) => o.trim().toLowerCase())
        .filter((o) => o !== "");

      const unique = new Set(trimmedLowercase);
      return unique.size !== trimmedLowercase.length;
    });

    if (hasMultiSelectDuplicates) {
      showSnackbar(
        "Each multi-select must have only unique values.",
        "top",
        "error",
      );
      return;
    }

    if (updateResult.success) {
      showSnackbar("Template updated successfully.", "bottom", "success");
      router.back();

      // remove all prior errors from the template update source if service call succeeded
      setErrors((prev) =>
        prev.filter((error) => error.source !== "template:update"),
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
          source: "template:update",
        },
      ]);
      setShowError(true);
      showSnackbar("Failed to update template.", "bottom", "error");
    }
  };

  /**
   * Components used:
   *
   * - GradientBackground: Provides a gradient background for the screen.
   * - Card: A card component to display the header and help icon.
   * - IconTopRight: A component for the help icon in the top right corner.
   * - ThemedText: A themed text component for consistent styling.
   * - ItemCountContainer: A container for displaying item counts.
   * - ItemCount: A component to display the count of fields and previews.
   * - ItemTemplateCard: A component for each template card, allowing editing of title, type, rating, options, and preview state.
   * - AddButton: A button to add new template cards.
   * - BottomButtons: A component for the bottom action buttons (Cancel and Save).
   * - InfoPopup: A modal to display help information about item templates.
   * - DeleteModal: A modal for confirming the deletion of a template card.
   * - ErrorPopup: A modal to display errors that occur during the process.
   */
  return (
    <GradientBackground
      backgroundCardTopOffset={Platform.select({ ios: 100, android: 95 })}
      topPadding={Platform.select({ ios: 0, android: 15 })}
    >
      <>
        {isSmallScreen || isHighCard ? (
          <>
            <View style={{ flex: 1 }}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 40}
              >
                <ScrollView
                  contentContainerStyle={{ paddingBottom: 100, gap: 10 }}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={{ marginBottom: 10 }}>
                    <Card>
                      <IconTopRight onPress={() => setShowHelp(true)}>
                        <MaterialIcons
                          name="help-outline"
                          size={26}
                          color={
                            colorScheme === "light"
                              ? Colors.primary
                              : Colors.secondary
                          }
                        />
                      </IconTopRight>
                      <CardText>
                        <CardHeader>
                          <Header
                            title="Edit Template"
                            onIconPress={() => alert("Popup!")}
                          />
                        </CardHeader>
                        <ThemedText
                          fontSize="s"
                          fontWeight="light"
                          colorVariant={
                            colorScheme === "light" ? "grey" : "lightGrey"
                          }
                        >
                          Edit your Template for your Collection Items.
                        </ThemedText>
                      </CardText>
                    </Card>
                    <View style={{ paddingTop: 10 }}>
                      <ItemCountContainer>
                        <ItemCount colorScheme={colorScheme}>
                          <ThemedText
                            colorVariant={cards.length < 10 ? "primary" : "red"}
                          >
                            {otherCards.length + 1}
                          </ThemedText>
                          <ThemedText
                            colorVariant={
                              colorScheme === "light" ? "grey" : "lightGrey"
                            }
                          >
                            /10 Fields
                          </ThemedText>
                        </ItemCount>
                        <ItemCount colorScheme={colorScheme}>
                          <ThemedText
                            colorVariant={previewCount <= 2 ? "primary" : "red"}
                          >
                            {Math.min(previewCount, 3)}
                          </ThemedText>
                          <ThemedText
                            colorVariant={
                              colorScheme === "light" ? "grey" : "lightGrey"
                            }
                          >
                            /3 Preview
                          </ThemedText>
                        </ItemCount>
                      </ItemCountContainer>
                    </View>
                  </View>

                  {templates.map((card, index) => {
                    const trimmedOptions = (card.options ?? []).map((o) =>
                      o.trim(),
                    );

                    const hasEmptyOption =
                      card.type === "multi-select" &&
                      (trimmedOptions.length === 0 ||
                        trimmedOptions.some((o) => o === ""));

                    const noSelectables =
                      card.type === "multi-select" &&
                      trimmedOptions.length === 0;

                    return (
                      <ItemTemplateCard
                        key={card.attributeID}
                        isTitleCard={index === 0}
                        itemType={card.type}
                        textfieldIcon="short-text"
                        isPreview={card.preview ?? false}
                        title={card.attributeLabel}
                        rating={
                          card.symbol as keyof typeof MaterialIcons.glyphMap
                        }
                        options={card.options ?? undefined}
                        fieldCount={index + 1}
                        onTypeChange={(val) =>
                          handleTypeChange(card.attributeID ?? 0, val)
                        }
                        onTitleChange={(text) =>
                          handleTitleChange(card.attributeID ?? 0, text)
                        }
                        onRatingChange={(val) =>
                          handleRatingChange(card.attributeID ?? 0, val)
                        }
                        onOptionsChange={(val) =>
                          handleOptionsChange(card.attributeID ?? 0, val)
                        }
                        onRemove={() => {
                          handleRemoveCard(card.attributeID ?? 0);
                        }}
                        onPreviewToggle={() =>
                          handlePreviewToggle(card.attributeID ?? 0)
                        }
                        isExisting={card.isExisting}
                        hasNoInputError={
                          hasClickedNext && !card.attributeLabel?.trim()
                        }
                        hasNoMultiSelectableError={
                          hasClickedNext && hasEmptyOption
                        }
                        noSelectablesError={hasClickedNext && noSelectables}
                        hasClickedNext={hasClickedNext}
                      />
                    );
                  })}

                  <View style={{ paddingTop: 10 }}>
                    <AddButton
                      onPress={handleAddCard}
                      isDisabled={templates.length >= 10}
                    />
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </View>
          </>
        ) : (
          <>
            <View
              style={{ marginBottom: 10 }}
              onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                setCardHeight(height);
              }}
            >
              <Card>
                <IconTopRight onPress={() => setShowHelp(true)}>
                  <MaterialIcons
                    name="help-outline"
                    size={26}
                    color={
                      colorScheme === "light"
                        ? Colors.primary
                        : Colors.secondary
                    }
                  />
                </IconTopRight>
                <CardText>
                  <CardHeader>
                    <Header
                      title="Edit Template"
                      onIconPress={() => alert("Popup!")}
                    />
                  </CardHeader>
                  <ThemedText
                    fontSize="s"
                    fontWeight="light"
                    colorVariant={
                      colorScheme === "light" ? "grey" : "lightGrey"
                    }
                  >
                    Edit your Template for your Collection Items.
                  </ThemedText>
                </CardText>
              </Card>
              <View style={{ paddingTop: 10 }}>
                <ItemCountContainer>
                  <ItemCount colorScheme={colorScheme}>
                    <ThemedText
                      colorVariant={cards.length < 10 ? "primary" : "red"}
                    >
                      {otherCards.length + 1}
                    </ThemedText>
                    <ThemedText
                      colorVariant={
                        colorScheme === "light" ? "grey" : "lightGrey"
                      }
                    >
                      /10 Fields
                    </ThemedText>
                  </ItemCount>
                  <ItemCount colorScheme={colorScheme}>
                    <ThemedText
                      colorVariant={previewCount <= 2 ? "primary" : "red"}
                    >
                      {Math.min(previewCount, 3)}
                    </ThemedText>
                    <ThemedText
                      colorVariant={
                        colorScheme === "light" ? "grey" : "lightGrey"
                      }
                    >
                      /3 Preview
                    </ThemedText>
                  </ItemCount>
                </ItemCountContainer>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 40}
              >
                <ScrollView
                  contentContainerStyle={{ paddingBottom: 100, gap: 10 }}
                  showsVerticalScrollIndicator={false}
                >
                  {templates.map((card, index) => {
                    const trimmedOptions = (card.options ?? []).map((o) =>
                      o.trim(),
                    );

                    const hasEmptyOption =
                      card.type === "multi-select" &&
                      (trimmedOptions.length === 0 ||
                        trimmedOptions.some((o) => o === ""));

                    const noSelectables =
                      card.type === "multi-select" &&
                      trimmedOptions.length === 0;

                    return (
                      <ItemTemplateCard
                        key={card.attributeID}
                        isTitleCard={index === 0}
                        itemType={card.type}
                        textfieldIcon="short-text"
                        isPreview={card.preview ?? false}
                        title={card.attributeLabel}
                        rating={
                          card.symbol as keyof typeof MaterialIcons.glyphMap
                        }
                        options={card.options ?? undefined}
                        fieldCount={index + 1}
                        onTypeChange={(val) =>
                          handleTypeChange(card.attributeID ?? 0, val)
                        }
                        onTitleChange={(text) =>
                          handleTitleChange(card.attributeID ?? 0, text)
                        }
                        onRatingChange={(val) =>
                          handleRatingChange(card.attributeID ?? 0, val)
                        }
                        onOptionsChange={(val) =>
                          handleOptionsChange(card.attributeID ?? 0, val)
                        }
                        onRemove={() => {
                          handleRemoveCard(card.attributeID ?? 0);
                        }}
                        onPreviewToggle={() =>
                          handlePreviewToggle(card.attributeID ?? 0)
                        }
                        isExisting={card.isExisting}
                        hasNoInputError={
                          hasClickedNext && !card.attributeLabel?.trim()
                        }
                        hasNoMultiSelectableError={
                          hasClickedNext && hasEmptyOption
                        }
                        noSelectablesError={hasClickedNext && noSelectables}
                        hasClickedNext={hasClickedNext}
                      />
                    );
                  })}

                  <View style={{ paddingTop: 10 }}>
                    <AddButton
                      onPress={handleAddCard}
                      isDisabled={templates.length >= 10}
                    />
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </View>
          </>
        )}

        {(Platform.OS !== "android" || !keyboardVisible) && (
          <View
            style={{
              paddingBottom: Platform.OS === "android" ? 8 : 24,
            }}
          >
            <BottomButtons
              titleLeftButton="Cancel"
              titleRightButton="Save"
              onDiscard={() => {
                router.back();
              }}
              onNext={() => {
                handleSave();
              }}
              variant="back"
              hasProgressIndicator={false}
              progressStep={2}
            />
          </View>
        )}
        {showHelp && (
          <InfoPopup
            visible={showHelp}
            onClose={() => setShowHelp(false)}
            image={require("@/assets/images/item_template_popup.png")}
            title="What is an Item Template?"
            description={`Item Templates regulate what kind of fields you can enter for each item of the Collection. For example, inside your Books Collection you could create a Template for each Book you want to put into the Collection — like genres! 📚`}
          />
        )}

        <DeleteModal
          visible={showDeleteModal}
          title={attributeToDelete?.attributeLabel ?? "field"}
          extraInformation="Deleting this field will also remove all its uses in your existing items in the collection."
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          onClose={() => setShowDeleteModal(false)}
        />
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
      </>
    </GradientBackground>
  );
}
