import React, { FC, useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
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
  const [hasClickedNext, setHasClickedNext] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const colorScheme = useActiveColorScheme();
  const cards = data.lists;

  useEffect(() => {
    if (data.lists.length === 0) {
      const initialCard = { id: Date.now().toString(), title: "" };
      setData((prev) => ({ ...prev, lists: [initialCard] }));
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === "android") {
      const keyboardDidShow = Keyboard.addListener("keyboardDidShow", () =>
        setKeyboardVisible(true),
      );
      const keyboardDidHide = Keyboard.addListener("keyboardDidHide", () =>
        setKeyboardVisible(false),
      );
      return () => {
        keyboardDidShow.remove();
        keyboardDidHide.remove();
      };
    }
  }, []);

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

  return (
    <>
      <Card>
        <CardText>
          <CardHeader>
            <ThemedText fontSize="l" fontWeight="bold">
              Adding Lists
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
      <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={ListContent}
        showsVerticalScrollIndicator={false}
      >
        {cards.map((item, index) => (
          <Card key={item.id}>
            <ThemedText
              fontSize="regular"
              fontWeight="regular"
              style={{ marginBottom: 15 }}
            >
              List {index + 1}
            </ThemedText>
            <Textfield
              showTitle={false}
              textfieldIcon="text-fields"
              placeholderText="Add a title to your note"
              title=""
              value={item.title}
              onChangeText={(text) => handleTitleChange(item.id, text)}
              hasNoInputError={hasClickedNext && !item.title}
              maxLength={30}
            />
            {index > 0 && (
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
            )}
          </Card>
        ))}

        {cards.length < 10 && (
          <AddButtonWrapper>
            <AddButton
              onPress={() => {
                handleAddCard();
                setHasClickedNext(false);
              }}
            />
          </AddButtonWrapper>
        )}
      </ScrollView>
      {(Platform.OS !== "android" || !keyboardVisible) && (
        <View style={{ paddingBottom: Platform.OS === "android" ? 8 : 24 }}>
          <BottomButtons
            titleLeftButton="Back"
            titleRightButton="Next"
            onDiscard={onBack!}
            onNext={() => {
              setHasClickedNext(true);
              const allTitlesFilled = cards.every(
                (card) => card.title && card.title.trim() !== "",
              );
              if (allTitlesFilled) {
                onNext?.();
              }
            }}
            variant="back"
            hasProgressIndicator={true}
            progressStep={2}
          />
        </View>
      )}
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
