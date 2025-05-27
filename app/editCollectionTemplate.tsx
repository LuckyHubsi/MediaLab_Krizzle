import React, { useEffect, useState } from "react";
import {
  View,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useServices } from "@/context/ServiceContext";
import { ItemTemplateDTO } from "@/shared/dto/ItemTemplateDTO";
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

export default function EditCollectionTemplateScreen() {
  const { collectionService, itemTemplateService } = useServices();
  const router = useRouter();
  const colorScheme = useActiveColorScheme();
  const { showSnackbar } = useSnackbar();

  const { collectionId, templateId } = useLocalSearchParams<{
    collectionId: string;
    templateId: string;
  }>();

  const [title, setTitle] = useState("");
  const [templates, setTemplates] = useState<AttributeDTO[]>([]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [hasClickedNext, setHasClickedNext] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const cards = templates;
  const otherCards = cards.slice(1);
  const previewCount = templates.filter((card) => card.preview).length;
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

  useEffect(() => {
    const loadData = async () => {
      const collection = await collectionService.getCollectionByPageId(
        Number(collectionId),
      );
      const template = await itemTemplateService.getTemplate(
        Number(templateId),
      );

      if (collection && template) {
        setTitle(collection.page_title);

        const updated = [...(template.attributes ?? [])];
        if (updated.length > 0) {
          updated[0].type = AttributeType.Text;
          updated[0].preview = true;
        }

        setTemplates(updated);
      }
    };

    loadData();
  }, []);

  const handleTitleChange = (id: number, text: string) => {
    setTemplates((prev) =>
      prev.map((card) =>
        card.attributeID === id ? { ...card, attributeLabel: text } : card,
      ),
    );
  };

  const handleTypeChange = (id: number, newType: string) => {
    setTemplates((prev) =>
      prev.map((card, index) =>
        card.attributeID === id && index !== 0
          ? { ...card, type: newType as AttributeType }
          : card,
      ),
    );
  };

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

  const handleOptionsChange = (id: number, options: string[]) => {
    setTemplates((prev) =>
      prev.map((card) =>
        card.attributeID === id ? { ...card, options } : card,
      ),
    );
  };

  const handleRemoveCard = (id: number) => {
    setTemplates((prev) => prev.filter((card) => card.attributeID !== id));
  };

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
      } as AttributeDTO,
    ]);
  };

  const handlePreviewToggle = (id: number) => {
    setTemplates((prev) => {
      const currentlySelected = prev.filter((c) => c.preview).length;
      return prev.map((card, index) => {
        const isFirst = index === 0;
        if (card.attributeID === id) {
          if (isFirst) return card;
          const togglingOn = !card.preview;
          if (togglingOn && currentlySelected >= 3) return card;
          return { ...card, preview: togglingOn };
        }
        return card;
      });
    });
  };

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
        "bottom",
        "error",
      );
      return;
    }

    const updatedTemplate: ItemTemplateDTO = {
      template_name: `${title} template`,
      attributes: templates,
    };

    console.log("Simulated updateTemplate call. TemplateDTO:", updatedTemplate);
    const success = true;
    if (success) {
      showSnackbar("Template updated successfully.", "bottom", "success");
      router.back();
    } else {
      showSnackbar("Failed to update template.", "bottom", "error");
    }
  };

  return (
    <GradientBackground
      backgroundCardTopOffset={Platform.select({ ios: 100, android: 95 })}
      topPadding={Platform.select({ ios: 0, android: 15 })}
    >
      <View style={{ flex: 1 }}>
        <View style={{ marginBottom: 10 }}>
          <Card>
            <IconTopRight onPress={() => setShowHelp(true)}>
              <MaterialIcons
                name="help-outline"
                size={26}
                color={Colors.primary}
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
                colorVariant={colorScheme === "light" ? "grey" : "lightGrey"}
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
                  colorVariant={colorScheme === "light" ? "grey" : "lightGrey"}
                >
                  /10 Item Types
                </ThemedText>
              </ItemCount>
              <ItemCount colorScheme={colorScheme}>
                <ThemedText
                  colorVariant={previewCount <= 2 ? "primary" : "red"}
                >
                  {Math.min(previewCount, 3)}
                </ThemedText>
                <ThemedText
                  colorVariant={colorScheme === "light" ? "grey" : "lightGrey"}
                >
                  /3 Preview
                </ThemedText>
              </ItemCount>
            </ItemCountContainer>
          </View>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 40}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 80, gap: 10 }}
            showsVerticalScrollIndicator={false}
          >
            {templates.map((card, index) => (
              <ItemTemplateCard
                key={card.attributeID}
                isTitleCard={index === 0}
                itemType={card.type}
                textfieldIcon="short-text"
                isPreview={card.preview ?? false}
                title={card.attributeLabel}
                rating={card.symbol as keyof typeof MaterialIcons.glyphMap}
                options={card.options ?? undefined}
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
                onRemove={() => handleRemoveCard(card.attributeID ?? 0)}
                hasNoInputError={hasClickedNext && !card.attributeLabel?.trim()}
                hasNoMultiSelectableError={
                  hasClickedNext &&
                  card.type === "multi-select" &&
                  (!card.options ||
                    card.options.length === 0 ||
                    card.options.some((o) => o.trim() === ""))
                }
                onPreviewToggle={() =>
                  handlePreviewToggle(card.attributeID ?? 0)
                }
              />
            ))}
            <View style={{ paddingTop: 10 }}>
              <AddButton
                onPress={handleAddCard}
                isDisabled={templates.length >= 10}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {(Platform.OS !== "android" || !keyboardVisible) && (
          <View style={{ paddingBottom: Platform.OS === "android" ? 8 : 24 }}>
            <BottomButtons
              variant="back"
              titleLeftButton="Back"
              titleRightButton="Save"
              onDiscard={() => router.back()}
              onNext={handleSave}
              hasProgressIndicator={false}
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
      </View>
    </GradientBackground>
  );
}
