import React, { FC, useEffect, useState } from "react";
import { Alert, FlatList, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card } from "@/components/ui/Card/Card";
import { AddButton } from "@/components/ui/AddButton/AddButton";
import { ThemedText } from "@/components/ThemedText";
import { InfoPopup } from "@/components/Modals/InfoModal/InfoModal";

import { Colors } from "@/constants/Colors";

import { useActiveColorScheme } from "@/context/ThemeContext";
import Textfield from "../Textfield/Textfield";
import {
  CardHeader,
  CardText,
} from "../CreateCollectionSteps/CreateCollectionTemplate/CreateCollectionTemplate.styles";
import BottomButtons from "../BottomButtons/BottomButtons";
import { CollectionData } from "../CreateCollectionSteps/CreateCollection/CreateCollection";
import {
  AddButtonWrapper,
  ListContent,
  RemoveButtonContainer,
  RemoveButtonContent,
} from "./EditCollectionLists.styles.";
import RemoveButton from "../RemoveButton/RemoveButton";

interface EditCollectionListProps {
  data: CollectionData;
  setData: React.Dispatch<React.SetStateAction<CollectionData>>;
  onBack?: () => void;
  onNext?: () => void;
}

const EditCollectionLists: FC<EditCollectionListProps> = ({
  data,
  setData,
  onBack,
  onNext,
}) => {
  const [hasClickedNext, setHasClickedNext] = useState(false);

  const [showHelp, setShowHelp] = useState(false);
  const cards = data.lists;

  const handleAddCard = () => {
    const newCard = { id: Date.now().toString(), title: "" };
    setData((prev) => ({
      ...prev,
      lists: [...prev.lists, newCard],
    }));
  };

  const handleRemoveCard = (id: string) => {
    setData((prev) => ({
      ...prev,
      lists: prev.lists.filter((card) => card.id !== id),
    }));
  };

  const handleTitleChange = (id: string, text: string) => {
    setData((prev) => ({
      ...prev,
      lists: prev.lists.map((card) =>
        card.id === id ? { ...card, title: text } : card,
      ),
    }));
  };

  useEffect(() => {
    if (data.lists.length === 0) {
      const initialCard = { id: Date.now().toString(), title: "" };
      setData((prev) => ({ ...prev, lists: [initialCard] }));
    }
  }, []);

  const colorScheme = useActiveColorScheme();
  const iconColor =
    colorScheme === "dark" ? Colors.dark.text : Colors.light.text;

  return (
    <>
      <Card>
        <CardText>
          <CardHeader>
            <ThemedText fontSize="l" fontWeight="bold">
              Edit Lists
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
            Edit the title of your lists.
          </ThemedText>
        </CardText>
      </Card>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ ...ListContent, paddingBottom: 95 }}
        renderItem={({ item }) => {
          const index = cards.findIndex((card) => card.id === item.id);
          return (
            <Card>
              <ThemedText
                fontSize="regular"
                fontWeight="regular"
                style={{ marginBottom: 15 }}
              >
                List {cards.findIndex((card) => card.id === item.id) + 1}
              </ThemedText>
              <Textfield
                showTitle={false}
                textfieldIcon="text-fields"
                placeholderText={`Add a title`}
                title={""}
                value={item.title}
                onChangeText={(text) => handleTitleChange(item.id, text)}
                hasNoInputError={hasClickedNext && !item.title}
                maxLength={30}
              />

              {index > 0 && (
                <RemoveButtonContainer>
                  <RemoveButton onPress={() => handleRemoveCard(item.id)} />
                </RemoveButtonContainer>
              )}
            </Card>
          );
        }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          cards.length < 10 ? (
            <AddButtonWrapper>
              <AddButton
                onPress={() => {
                  handleAddCard();
                  setHasClickedNext(false);
                }}
              />
            </AddButtonWrapper>
          ) : null
        }
      />

      <BottomButtons
        titleLeftButton="Cancel"
        titleRightButton="Save"
        onDiscard={onBack!}
        onNext={() => {
          setHasClickedNext(true);
          //check if all textfields are filled
          const allTitlesFilled = cards.every(
            (card) => card.title && card.title.trim() !== "",
          );

          if (!allTitlesFilled) {
            return;
          }

          onNext?.();
        }}
        variant="back"
        hasProgressIndicator={false}
        progressStep={2}
      />

      {showHelp && (
        <InfoPopup
          visible={showHelp}
          onClose={() => setShowHelp(false)}
          image={require("@/assets/images/list-guide.png")}
          title="What is a Collection List?"
          description={`Create Lists to group together related Items from one category together.\n\nFor example, inside your Books Collection you could create Lists for “Read Books”, “Book Wishlist” or anything you’d like.\n\nMake it your own!`}
        />
      )}
    </>
  );
};

export default EditCollectionLists;
