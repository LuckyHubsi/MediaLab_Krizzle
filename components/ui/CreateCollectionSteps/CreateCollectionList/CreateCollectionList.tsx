import React, { FC, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card } from "@/components/ui/Card/Card";
import { AddButton } from "@/components/ui/AddButton/AddButton";
import { ThemedText } from "@/components/ThemedText";
import { InfoPopup } from "@/components/Modals/InfoModal/InfoModal";
import BottomButtons from "../../BottomButtons/BottomButtons";
import Textfield from "../../Textfield/Textfield";

import { Colors } from "@/constants/Colors";
import {
  AddButtonWrapper,
  ListContent,
  RemoveButton,
  RemoveButtonContent,
} from "./CreateCollectionList.styles";

import type { CollectionData } from "../CreateCollection/CreateCollection";
import {
  CardText,
  CardHeader,
} from "../CreateCollectionTemplate/CreateCollectionTemplate.styles";
import { useActiveColorScheme } from "@/context/ThemeContext";

interface CreateCollectionListProps {
  data: CollectionData;
  setData: React.Dispatch<React.SetStateAction<CollectionData>>;
  onBack?: () => void;
  onNext?: () => void;
}

const CreateCollectionList: FC<CreateCollectionListProps> = ({
  data,
  setData,
  onBack,
  onNext,
}) => {
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

  const colorScheme = useActiveColorScheme();
  const iconColor =
    colorScheme === "dark" ? Colors.dark.text : Colors.light.text;

  return (
    <>
      <Card>
        <CardText>
          <CardHeader>
            <ThemedText fontSize="l" fontWeight="bold">
              Adding Lists{" "}
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
            Add Lists to organize your Collections
          </ThemedText>
        </CardText>
      </Card>

      <FlatList
        data={cards}
        keyExtractor={(item) => item.id}
        contentContainerStyle={ListContent}
        renderItem={({ item }) => (
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
              placeholderText={`Add a title to your note`}
              title={""}
              value={item.title}
              onChangeText={(text) => handleTitleChange(item.id, text)}
            />
            <RemoveButton onPress={() => handleRemoveCard(item.id)}>
              <RemoveButtonContent>
                <MaterialIcons
                  name="delete"
                  size={16}
                  color="#ff4d4d"
                  style={{ marginRight: 6, marginTop: 2 }}
                />
                <ThemedText
                  fontSize="s"
                  fontWeight="bold"
                  style={{ color: "#ff4d4d" }}
                >
                  remove
                </ThemedText>
              </RemoveButtonContent>
            </RemoveButton>
          </Card>
        )}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <AddButtonWrapper>
            <AddButton onPress={handleAddCard} />
          </AddButtonWrapper>
        }
      />

      <BottomButtons
        titleLeftButton="Back"
        titleRightButton="Next"
        onDiscard={onBack!}
        onNext={onNext!}
        variant="back"
        hasProgressIndicator={true}
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

export default CreateCollectionList;
