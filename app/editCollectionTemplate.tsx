import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useServices } from "@/context/ServiceContext";
import { CollectionDTO } from "@/shared/dto/CollectionDTO";
import { ItemTemplateDTO } from "@/shared/dto/ItemTemplateDTO";
import { AttributeDTO } from "@/shared/dto/AttributeDTO";
import { PageType } from "@/shared/enum/PageType";
import { AttributeType } from "@/shared/enum/AttributeType";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
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
} from "@/components/ui/CreateCollectionSteps/CreateCollectionTemplate/CreateCollectionTemplate.styles";
import { Header } from "@/components/ui/Header/Header";
import { GradientBackgroundWrapper } from "@/components/ui/GradientBackground/GradientBackground.styles";
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
        setTemplates(template.attributes ?? []);
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
      prev.map((card) =>
        card.attributeID === id
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
                Create a Template for your Collection Items.
              </ThemedText>
            </CardText>
          </Card>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 40}
        >
          <ScrollView contentContainerStyle={{ paddingBottom: 80, gap: 10 }}>
            {templates.map((card) => (
              <ItemTemplateCard
                key={card.attributeID}
                isTitleCard={false}
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
