import { FC, useState, useEffect } from "react";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import {
  ItemCountContainer,
  ItemCount,
  CardHeader,
  CardText,
} from "./CreateCollectionTemplate.styles";
import { AddButton } from "../../AddButton/AddButton";
import BottomButtons from "../../BottomButtons/BottomButtons";
import ItemTemplateCard from "./ItemTemplateCard/ItemTemplateCard";
import { MaterialIcons } from "@expo/vector-icons";
import type { CollectionData } from "../CreateCollection/CreateCollection";
import { Card } from "../../Card/Card";
import { Colors } from "@/constants/Colors";
import { InfoPopup } from "@/components/Modals/InfoModal/InfoModal";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { useSnackbar } from "../../Snackbar/Snackbar";
import { IconTopRight } from "../../IconTopRight/IconTopRight";

interface CreateCollectionTemplateProps {
  data: CollectionData;
  setData: React.Dispatch<React.SetStateAction<CollectionData>>;
  onBack?: () => void;
  onNext?: () => void;
}

const CreateCollectionTemplate: FC<CreateCollectionTemplateProps> = ({
  data,
  setData,
  onBack,
  onNext,
}) => {
  const maxPreviewCount = 2;
  const colorScheme = useActiveColorScheme();
  const cards = data.templates;

  const [hasClickedNext, setHasClickedNext] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const titleCard = cards[0];
  const otherCards = cards.slice(1);

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
    if (!titleCard) {
      setData((prev) => ({
        ...prev,
        templates: [
          {
            id: 0,
            itemType: "text",
            isPreview: true,
            title: "",
            options: [],
            rating: "star" as keyof typeof MaterialIcons.glyphMap,
          },
          ...prev.templates,
        ],
      }));
    }
  }, []);

  const getIconForType = (type: string) => {
    switch (type) {
      case "text":
        return "short-text";
      case "date":
        return "calendar-today";
      case "multi-select":
        return "layers";
      case "rating":
        return "star-rate";
      case "image":
        return "image";
      case "link":
        return "attach-file";
      default:
        return "short-text";
    }
  };

  const previewCount = otherCards.filter((card) => card.isPreview).length + 1;

  const handleAddCard = () => {
    if (otherCards.length >= 9) return;
    setData((prev) => ({
      ...prev,
      templates: [
        ...prev.templates,
        {
          id: prev.templates.length,
          itemType: "text",
          isPreview: false,
          title: "",
          options: [],
          rating: "star" as keyof typeof MaterialIcons.glyphMap,
        },
      ],
    }));
  };

  const handleRemoveCard = (id: number) => {
    setData((prev) => ({
      ...prev,
      templates: prev.templates.filter((card) => card.id !== id),
    }));
  };

  const handleTypeChange = (id: number, newType: string) => {
    setData((prev) => {
      const updatedTemplates = prev.templates.map((card) => {
        if (card.id !== id) return card;

        const isChangingType = card.itemType !== newType;
        const isPreview = card.isPreview;

        if (isChangingType && isPreview) {
          const isTypeAlreadyPreviewed = prev.templates.some(
            (c) => c.id !== id && c.isPreview && c.itemType === newType,
          );

          if (isTypeAlreadyPreviewed) {
            showSnackbar(
              "Preview was disabled because another field already uses that type.",
              "top",
              "error",
            );
            return { ...card, itemType: newType, isPreview: false };
          }
        }

        return { ...card, itemType: newType };
      });

      return {
        ...prev,
        templates: updatedTemplates,
      };
    });
  };

  const handleTitleChange = (id: number, text: string) => {
    setData((prev) => ({
      ...prev,
      templates: prev.templates.map((card) =>
        card.id === id ? { ...card, title: text } : card,
      ),
    }));
  };

  const handleRatingChange = (
    id: number,
    ratingValue: keyof typeof MaterialIcons.glyphMap,
  ) => {
    setData((prev) => ({
      ...prev,
      templates: prev.templates.map((card) =>
        card.id === id ? { ...card, rating: ratingValue } : card,
      ),
    }));
  };

  const handleOptionsChange = (id: number, newOptions: string[]) => {
    setData((prev) => ({
      ...prev,
      templates: prev.templates.map((card) =>
        card.id === id ? { ...card, options: newOptions } : card,
      ),
    }));
  };

  const { showSnackbar } = useSnackbar();

  const handlePreviewToggle = (id: number) => {
    const currentCard = otherCards.find((c) => c.id === id);
    if (!currentCard) return;

    const currentlyActivePreviews = otherCards.filter((c) => c.isPreview);
    const isCurrentlyPreviewed = currentCard.isPreview;
    const newPreviewState = !isCurrentlyPreviewed;

    if (newPreviewState) {
      const typeAlreadyUsed = currentlyActivePreviews.some(
        (card) => card.itemType === currentCard.itemType,
      );
      const underMaxPreviewCount =
        currentlyActivePreviews.length < maxPreviewCount;

      if (!underMaxPreviewCount) {
        showSnackbar(
          "You can only select up to 3 preview items.",
          "top",
          "error",
        );
        return;
      }

      if (typeAlreadyUsed) {
        showSnackbar(
          "Only one preview is allowed per item type.",
          "top",
          "error",
        );
        return;
      }
    }

    setData((prev) => ({
      ...prev,
      templates: prev.templates.map((card) =>
        card.id === id ? { ...card, isPreview: newPreviewState } : card,
      ),
    }));
  };

  const iconColor =
    colorScheme === "dark" ? Colors.dark.text : Colors.light.text;

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 40}
      >
        <View style={{ gap: 10, paddingBottom: 10 }}>
          <Card>
            <IconTopRight onPress={() => setShowHelp(true)}>
              <MaterialIcons
                name="help-outline"
                size={26}
                color={
                  colorScheme === "light" ? Colors.primary : Colors.secondary
                }
              />
            </IconTopRight>
            <CardText>
              <CardHeader>
                <ThemedText fontSize="l" fontWeight="bold">
                  Add Template
                </ThemedText>
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

          <ItemCountContainer>
            <ItemCount colorScheme={colorScheme}>
              <ThemedText colorVariant={cards.length < 10 ? "primary" : "red"}>
                {otherCards.length + 1}
              </ThemedText>
              <ThemedText
                colorVariant={colorScheme === "light" ? "grey" : "lightGrey"}
              >
                /10 Fields
              </ThemedText>
            </ItemCount>
            <ItemCount colorScheme={colorScheme}>
              <ThemedText colorVariant={previewCount <= 2 ? "primary" : "red"}>
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
        <ScrollView
          contentContainerStyle={{ paddingBottom: 80, gap: 10 }}
          showsVerticalScrollIndicator={false}
        >
          {titleCard && (
            <ItemTemplateCard
              isTitleCard
              itemType={titleCard.itemType}
              textfieldIcon={getIconForType(titleCard.itemType)}
              isPreview
              title={titleCard.title}
              onTitleChange={(text) => handleTitleChange(titleCard.id, text)}
              hasNoInputError={
                hasClickedNext &&
                (!titleCard.title || titleCard.title.trim() === "")
              }
            />
          )}

          <ThemedText
            colorVariant="greyScale"
            style={{ marginLeft: 10, marginTop: 10 }}
          >
            Your Additional Fields:
          </ThemedText>

          {otherCards.map((card, index) => {
            const trimmedOptions = (card.options ?? []).map((o) => o.trim());
            const lowerTrimmedOptions = trimmedOptions
              .map((o) => o.toLowerCase())
              .filter((o) => o !== "");

            const hasEmptyOption =
              card.itemType === "multi-select" &&
              (trimmedOptions.length === 0 ||
                trimmedOptions.some((o) => o === ""));

            const hasDuplicates =
              card.itemType === "multi-select" &&
              new Set(lowerTrimmedOptions).size !== lowerTrimmedOptions.length;

            const noSelectables =
              card.itemType === "multi-select" && trimmedOptions.length === 0;

            return (
              <ItemTemplateCard
                key={card.id}
                isTitleCard={false}
                isPreview={card.isPreview}
                itemType={card.itemType}
                textfieldIcon={getIconForType(card.itemType)}
                title={card.title}
                rating={card.rating}
                options={card.options}
                onTypeChange={(newType) => handleTypeChange(card.id, newType)}
                onTitleChange={(text) => handleTitleChange(card.id, text)}
                onRatingChange={(newRating) =>
                  handleRatingChange(card.id, newRating)
                }
                onOptionsChange={(newOptions) =>
                  handleOptionsChange(card.id, newOptions)
                }
                onRemove={() => handleRemoveCard(card.id)}
                onPreviewToggle={() => handlePreviewToggle(card.id)}
                hasNoInputError={
                  hasClickedNext && (!card.title || card.title.trim() === "")
                }
                hasNoMultiSelectableError={hasClickedNext && hasEmptyOption}
                noSelectablesError={hasClickedNext && noSelectables}
                hasClickedNext={hasClickedNext} // ← 🔥 THIS IS THE CRUCIAL PART
                previewCount={previewCount}
                fieldCount={index + 2}
              />
            );
          })}

          <View style={{ paddingTop: 10 }}>
            <AddButton
              onPress={() => {
                handleAddCard();
                setHasClickedNext(false);
              }}
              isDisabled={otherCards.length >= 9}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {(Platform.OS !== "android" || !keyboardVisible) && (
        <View style={{ paddingBottom: Platform.OS === "android" ? 8 : 24 }}>
          <BottomButtons
            variant="back"
            titleLeftButton="Back"
            titleRightButton="Add"
            onDiscard={onBack!}
            onNext={() => {
              setHasClickedNext(true);

              const isMainTitleFilled = !!titleCard?.title?.trim();

              const allOtherTitlesFilled = otherCards.every((card) => {
                const titleFilled = !!card.title?.trim();

                if (card.itemType === "multi-select") {
                  const hasValidOptions =
                    (card?.options ?? []).length > 0 &&
                    (card.options ?? []).every((o) => o.trim() !== "");
                  return titleFilled && hasValidOptions;
                }

                return titleFilled;
              });

              // 🔍 Check for duplicate multi-select values
              const hasMultiSelectDuplicates = otherCards.some((card) => {
                if (card.itemType !== "multi-select" || !card.options)
                  return false;

                const lowerTrimmed = card.options
                  .map((o) => o.trim().toLowerCase())
                  .filter((o) => o !== "");

                const unique = new Set(lowerTrimmed);
                return unique.size !== lowerTrimmed.length;
              });

              if (!isMainTitleFilled || !allOtherTitlesFilled) {
                showSnackbar(
                  "Almost there! Just add all the titles and pick at least one option.",
                  "top",
                  "error",
                );
                return;
              }

              if (hasMultiSelectDuplicates) {
                showSnackbar(
                  "Each multi-select must have only unique values.",
                  "top",
                  "error",
                );
                return;
              }

              onNext?.();

              showSnackbar(
                `Successfully created Collection: "${data.title}".`,
                "bottom",
                "success",
              );
            }}
            hasProgressIndicator={false}
            progressStep={3}
          />
        </View>
      )}

      {showHelp && (
        <InfoPopup
          visible={showHelp}
          onClose={() => setShowHelp(false)}
          image={require("@/assets/images/item_template_popup.png")}
          title="What is an Item Template?"
          description={`Item Templates regulate what kind of fields you can enter for each (new) item of the Collection. For example, inside your Books Collection you could create a Template for each Book you want to put into the Collection. Like genres!  📚`}
        />
      )}
    </>
  );
};

export default CreateCollectionTemplate;
