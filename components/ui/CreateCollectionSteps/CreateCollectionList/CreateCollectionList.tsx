import React, { FC, useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
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
  ItemCount,
  ItemCountContainer,
  ListContent,
  RemoveButtonContainer,
  HorizontalTitleRow,
} from "./CreateCollectionList.styles";
import type { CollectionData } from "../CreateCollection/CreateCollection";
import {
  CardText,
  CardHeader,
} from "../CreateCollectionTemplate/CreateCollectionTemplate.styles";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { useSnackbar } from "../../Snackbar/Snackbar";
import { IconTopRight } from "../../IconTopRight/IconTopRight";
import RemoveButton from "../../RemoveButton/RemoveButton";

/**
 * Component for creating a list of collections.
 * This component allows users to add, remove, and edit collection lists.
 * @param data (required) - The current collection data containing lists.
 * @param setData (required) - Function to update the collection data.
 * @param onBack - Optional callback for the back button.
 * @param onNext - Optional callback for the next button.
 */

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
  const { showSnackbar } = useSnackbar();

  const cards = data.lists;
  const titleMap: Record<string, number[]> = {};

  const Wrapper =
    Platform.OS === "ios" ? TouchableWithoutFeedback : React.Fragment;

  /**
   * Effect to initialize the first card if no lists exist.
   */
  useEffect(() => {
    if (data.lists.length === 0) {
      const initialCard = { id: Date.now().toString(), title: "" };
      setData((prev) => ({ ...prev, lists: [initialCard] }));
    }
  }, []);

  /**
   * Effect to add listeners for keyboard show and hide events to update the keyboardVisible state.
   */
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

  /**
   * Function to handle adding a new card to the list.
   * A new card is created with a unique ID and an empty title.
   */
  const handleAddCard = () => {
    const newCard = { id: Date.now().toString(), title: "" };
    setData((prev) => ({
      ...prev,
      lists: [...prev.lists, newCard],
    }));
  };

  /**
   * Function to handle removing a card from the list.
   * @param id - The ID of the card to be removed.
   */
  const handleRemoveCard = (id: string) => {
    setData((prev) => ({
      ...prev,
      lists: prev.lists.filter((card) => card.id !== id),
    }));
  };

  /**
   * Function to handle changes to the title of a card.
   * @param id - The ID of the card whose title is being changed.
   * @param text - The new title text.
   */
  const handleTitleChange = (id: string, text: string) => {
    setData((prev) => ({
      ...prev,
      lists: prev.lists.map((card) =>
        card.id === id ? { ...card, title: text } : card,
      ),
    }));
  };

  /**
   * Maps normalized card titles to their indexes in the `cards` array.
   * Titles are trimmed and lowercased to catch duplicates regardless of formatting.
   */
  cards.forEach((card, index) => {
    const key = card.title.trim().toLowerCase();
    if (!titleMap[key]) {
      titleMap[key] = [];
    }
    titleMap[key].push(index);
  });

  /**
   * Collects IDs of cards with duplicate titles from `titleMap`.
   * Uses a Set to avoid duplicate entries.
   */
  const duplicateTitleIds = new Set<string>();
  Object.values(titleMap).forEach((indexes) => {
    if (indexes.length > 1) {
      indexes.forEach((i) => {
        duplicateTitleIds.add(cards[i].id);
      });
    }
  });

  return (
    <Wrapper
      {...(Platform.OS === "ios"
        ? { onPress: Keyboard.dismiss, accessible: false }
        : {})}
    >
      <View style={{ flex: 1 }}>
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
                Adding Lists
              </ThemedText>
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
        <ItemCountContainer>
          <ItemCount colorScheme={colorScheme}>
            <ThemedText colorVariant={cards.length < 10 ? "primary" : "red"}>
              {cards.length}
            </ThemedText>

            <ThemedText
              colorVariant={colorScheme === "light" ? "grey" : "lightGrey"}
            >
              /10 Lists
            </ThemedText>
          </ItemCount>
        </ItemCountContainer>
        <ScrollView
          contentContainerStyle={{ ...ListContent, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          {cards.map((item, index) => (
            <Card key={item.id}>
              <HorizontalTitleRow>
                <ThemedText fontSize="regular" fontWeight="regular">
                  List {index + 1}
                </ThemedText>
                {index === 0 && (
                  <ThemedText fontSize="s" colorVariant="red">
                    * required
                  </ThemedText>
                )}
              </HorizontalTitleRow>
              <Textfield
                showTitle={false}
                textfieldIcon="text-fields"
                placeholderText="Add a title"
                title=""
                value={item.title}
                onChangeText={(text) => handleTitleChange(item.id, text)}
                hasNoInputError={hasClickedNext && !item.title}
                hasDuplicateTitle={
                  hasClickedNext &&
                  item.title.trim() !== "" &&
                  duplicateTitleIds.has(item.id)
                }
                maxLength={30}
              />
              {index > 0 && (
                <RemoveButtonContainer>
                  <RemoveButton onPress={() => handleRemoveCard(item.id)} />
                </RemoveButtonContainer>
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
          <View
            style={{
              paddingTop: 15,
              paddingBottom: Platform.OS === "android" ? 8 : 24,
            }}
          >
            <BottomButtons
              titleLeftButton="Back"
              titleRightButton="Next"
              onDiscard={onBack!}
              onNext={() => {
                setHasClickedNext(true);

                const allTitlesFilled = cards.every(
                  (card) => card.title && card.title.trim() !== "",
                );

                if (!allTitlesFilled) {
                  showSnackbar(
                    "Please fill in all list titles.",
                    "bottom",
                    "error",
                  );
                  return;
                }

                const normalizedTitles = cards.map((card) =>
                  card.title.trim().toLowerCase(),
                );
                const uniqueTitles = new Set(normalizedTitles);

                if (uniqueTitles.size !== normalizedTitles.length) {
                  showSnackbar(
                    "Each list must have a unique title.",
                    "bottom",
                    "error",
                  );

                  return;
                }

                onNext?.();
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
            image={require("@/assets/images/list-guide.png")}
            title="What is a Collection List?"
            description={`Create Lists to group together related Items from one category together.\n\nFor example, inside your Books Collection you could create Lists for “Read Books”, “Book Wishlist” or anything you’d like.\n\nMake it your own!`}
          />
        )}
      </View>
    </Wrapper>
  );
};

export default CreateCollectionList;
