import { FC, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
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
import ProgressIndicator from "../ProgressionIndicator/ProgressionIndicator";
import { Card } from "../../Card/Card";
import { IconTopRight } from "../../IconTopRight/IconTopRight";
import { Colors } from "@/constants/Colors";
import { Header } from "../../Header/Header";
import { InfoPopup } from "@/components/Modals/InfoModal/InfoModal";

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
  const colorScheme = useColorScheme();
  const cards = data.templates;

  const textfieldIconArray: ("short-text" | "calendar-today" | "layers")[] = [
    "short-text",
    "calendar-today",
    "layers",
  ];

  const typeArray = ["item", "text", "date", "multi-select", "rating"];

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
      default:
        return "short-text";
    }
  };

  const previewCount = cards.filter((card) => card.isPreview).length + 1;

  const [showHelp, setShowHelp] = useState(false);
  const iconColor =
    colorScheme === "dark" ? Colors.dark.text : Colors.light.text;

  const handleAddCard = () => {
    if (cards.length >= 10) return;
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
    setData((prev) => ({
      ...prev,
      templates: prev.templates.map((card) =>
        card.id === id ? { ...card, itemType: newType } : card,
      ),
    }));
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

  const handlePreviewToggle = (id: number) => {
    const currentCard = cards.find((c) => c.id === id);
    const currentlyActive = cards.filter((c) => c.isPreview).length;

    if (!currentCard) return;

    const willBePreviewed = !currentCard.isPreview;
    const validToggle = willBePreviewed
      ? currentlyActive < maxPreviewCount
      : true;

    if (validToggle) {
      setData((prev) => ({
        ...prev,
        templates: prev.templates.map((card) =>
          card.id === id ? { ...card, isPreview: !card.isPreview } : card,
        ),
      }));
    }
  };

  return (
    <>
      <Card>
        <CardText>
          <CardHeader>
            <ThemedText fontSize="l" fontWeight="bold">
              Adding Templates
            </ThemedText>
            <TouchableOpacity onPress={() => setShowHelp(true)}>
              <MaterialIcons
                name="help-outline"
                size={26}
                color={Colors.primary}
              />
            </TouchableOpacity>
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
            {cards.length}
          </ThemedText>
          <ThemedText
            colorVariant={colorScheme === "light" ? "grey" : "lightGrey"}
          >
            /10 Item Types
          </ThemedText>
        </ItemCount>
        <ItemCount colorScheme={colorScheme}>
          <ThemedText colorVariant={previewCount <= 2 ? "primary" : "red"}>
            {Math.min(previewCount, 3)}
          </ThemedText>
          <ThemedText
            colorVariant={colorScheme === "light" ? "grey" : "lightGrey"}
          >
            /3 Item Previews
          </ThemedText>
        </ItemCount>
      </ItemCountContainer>

      <ScrollView contentContainerStyle={{ paddingBottom: 75 }}>
        <ItemTemplateCard
          isTitleCard={true}
          itemType={typeArray[1]}
          textfieldIcon={textfieldIconArray[0]}
          isPreview={true}
          title={data.templateTitle}
          onTitleChange={(text) =>
            setData((prev) => ({ ...prev, templateTitle: text }))
          }
        />
        <ThemedText colorVariant="grey" style={{ margin: 10 }}>
          Your Templates:
        </ThemedText>

        {cards.map((card) => (
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
          />
        ))}

        <AddButton onPress={handleAddCard} isDisabled={cards.length >= 10} />
        <ProgressIndicator progressStep={3} />
      </ScrollView>

      <BottomButtons
        variant={"back"}
        titleLeftButton={"Back"}
        titleRightButton={"Add"}
        onDiscard={onBack!}
        onNext={onNext!}
      />

      {showHelp && (
        <InfoPopup
          visible={showHelp}
          onClose={() => setShowHelp(false)}
          image={require("@/assets/images/item_template_popup.png")}
          title=" What is an Item Template?"
          description={`Item Templates regulate what kind of fields you can enter for each (new) item of the Collection.For example, inside your Books Collection you could create a Template for each Book you want to put into the Collection. Like genres!  📚`}
        />
      )}
    </>
  );
};

export default CreateCollectionTemplate;
