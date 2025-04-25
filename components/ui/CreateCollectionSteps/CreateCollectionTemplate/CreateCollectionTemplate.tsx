import { ThemedText } from "@/components/ThemedText";
import { FC, useState } from "react";
import {
  ItemCountContainer,
  ItemCount,
} from "./CreateCollectionTemplate.styles";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AddButton } from "../../AddButton/AddButton";
import BottomButtons from "../../BottomButtons/BottomButtons";
import ItemTemplateCard from "./ItemTemplateCard/ItemTemplateCard";
import { ScrollView } from "react-native";
import ProgressIndicator from "../ProgressionIndicator/ProgressionIndicator";

interface CreateCollectionTemplateProps {
  title: string;
}

const CreateCollectionTemplate: FC<CreateCollectionTemplateProps> = ({
  title,
}) => {
  const maxPreviewCount = 3;
  const colorScheme = useColorScheme();
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
  const [cards, setCards] = useState<
    { id: number; itemType: string; isPreview: boolean }[]
  >([]);

  const handleAddCard = () => {
    if (cards.length >= 10) return;
    setCards((prev) => [
      ...prev,
      { id: prev.length, itemType: "text", isPreview: false },
    ]);
  };

  const previewCount = cards.filter((card) => card.isPreview).length + 1;
  const handlePreviewToggle = (cardId: number) => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.id === cardId) {
          if (card.isPreview && previewCount <= maxPreviewCount) {
            return { ...card, isPreview: false };
          }

          if (!card.isPreview && previewCount < maxPreviewCount) {
            return { ...card, isPreview: true };
          }

          return card;
        }
        return card;
      }),
    );
  };

  return (
    <>
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
          <ThemedText colorVariant={previewCount < 3 ? "primary" : "red"}>
            {previewCount}
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
            onTypeChange={(newType) => {
              setCards((prev) =>
                prev.map((c) =>
                  c.id === card.id ? { ...c, itemType: newType } : c,
                ),
              );
            }}
            onRemove={() => {
              setCards((prev) => prev.filter((c) => c.id !== card.id));
            }}
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
        onDiscard={function (): void {
          throw new Error("Function not implemented.");
        }}
        onNext={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </>
  );
};

export default CreateCollectionTemplate;
