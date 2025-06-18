import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { GradientBackground } from "@/components/ui/GradientBackground/GradientBackground";
import { AddButton } from "@/components/ui/AddButton/AddButton";
import { InfoPopup } from "@/components/Modals/InfoModal/InfoModal";
import { MaterialIcons } from "@expo/vector-icons";
import {
  AddButtonWrapper,
  ItemCount,
  ItemCountContainer,
  ListContent,
  RemoveButtonContainer,
  HorizontalTitleRow,
} from "@/components/ui/CreateCollectionSteps/CreateCollectionList/CreateCollectionList.styles";
import {
  CardHeader,
  CardText,
} from "@/components/ui/CreateCollectionSteps/CreateCollectionTemplate/CreateCollectionTemplate.styles";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import Card from "@/components/ui/Card/Card";
import Textfield from "@/components/ui/Textfield/Textfield";
import BottomButtons from "@/components/ui/BottomButtons/BottomButtons";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";
import { useServices } from "@/context/ServiceContext";
import RemoveButton from "@/components/ui/RemoveButton/RemoveButton";
import { EnrichedError } from "@/shared/error/ServiceError";
import { ErrorPopup } from "@/components/Modals/ErrorModal/ErrorModal";

/**
 * Screen for editing collection lists.
 */
export default function EditCollectionListsScreen() {
  const { collectionId, pageId } = useLocalSearchParams<{
    collectionId: string;
    pageId: string;
  }>();
  const { collectionService } = useServices();
  const numericId = Number(collectionId);
  const colorScheme = useActiveColorScheme() ?? "light";
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listToDelete, setListToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [lists, setLists] = useState<{ id: string; title: string }[]>([]);
  const [initialIds, setInitialIds] = useState<Set<string>>(new Set());
  const [showHelp, setShowHelp] = useState(false);
  const [hasClickedNext, setHasClickedNext] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const isPersisted = (id: string) => !isNaN(Number(id)) && initialIds.has(id);
  const [isLoading, setIsLoading] = useState(true);
  const { showSnackbar } = useSnackbar();
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
      const show = Keyboard.addListener("keyboardDidShow", () =>
        setKeyboardVisible(true),
      );
      const hide = Keyboard.addListener("keyboardDidHide", () =>
        setKeyboardVisible(false),
      );
      return () => {
        show.remove();
        hide.remove();
      };
    }
  }, []);

  /**
   * Effect to load collection categories when the component mounts.
   * It retrieves the categories from the collection service and maps them to the required format.
   */
  useEffect(() => {
    (async () => {
      try {
        const listResult =
          await collectionService.getCollectionCategories(numericId);
        if (listResult.success) {
          const mapped = listResult.value.map((l) => ({
            id: l.collectionCategoryID?.toString() ?? Date.now().toString(),
            title: l.category_name ?? "",
          }));
          setLists(mapped);
          setInitialIds(new Set(mapped.map((l) => l.id)));

          // remove all prior errors from the list retrieval source if service call succeeded
          setErrors((prev) =>
            prev.filter((error) => error.source !== "list:retrieval"),
          );
        } else {
          // set all errors to the previous errors plus add the new error
          // define the id and the source and set its read status to false
          setErrors((prev) => [
            ...prev,
            {
              ...listResult.error,
              hasBeenRead: false,
              id: `${Date.now()}-${Math.random()}`,
              source: "list:retrieval",
            },
          ]);
          setShowError(true);
        }
      } catch (err) {
        console.error("Failed to load lists:", err);
        showSnackbar("Failed to load lists.", "top", "error");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [collectionId]);

  /**
   * Function to handle adding a new card (list).
   */
  const handleAddCard = () => {
    const newCard = { id: Date.now().toString(), title: "" };
    setLists((prev) => [...prev, newCard]);
  };

  /**
   * Function to handle removing a card (list).
   */
  const handleRemoveCard = (id: string) => {
    if (lists.length <= 1) {
      showSnackbar("You must have at least one list.", "top", "error");
      return;
    }

    /**
     * Find the list item by ID and set it for deletion confirmation.
     */
    const item = lists.find((l) => l.id === id);
    if (item) {
      setListToDelete(item);
      setShowDeleteModal(true);
    }
  };

  /**
   * Function to handle changes to the title of a list.
   */
  const handleTitleChange = (id: string, text: string) => {
    setLists((prev) =>
      prev.map((l) => (l.id === id ? { ...l, title: text } : l)),
    );
  };

  /**
   * Function to save all changes made to the lists.
   * It checks if all titles are filled, ensures uniqueness, and then either inserts or updates the lists.
   */
  const saveAllChanges = async () => {
    setHasClickedNext(true);

    const allTitlesFilled = lists.every((l) => l.title.trim() !== "");
    const seen = new Set<string>();
    const duplicateTitleIds = new Set<string>();

    lists.forEach((l) => {
      const key = l.title.trim().toLowerCase();
      if (seen.has(key)) {
        duplicateTitleIds.add(l.id);
      } else {
        seen.add(key);
      }
    });

    if (!allTitlesFilled) {
      showSnackbar("Please fill in all list titles.", "top", "error");
      return;
    }

    if (duplicateTitleIds.size > 0) {
      showSnackbar("Each list must have a unique title.", "top", "error");
      return;
    }

    let allSucceeded = true;

    for (const l of lists) {
      const updateDto = {
        collectionID: numericId,
        category_name: l.title,
        collectionCategoryID: Number(l.id),
      };

      if (!isPersisted(l.id)) {
        const insertListResult =
          await collectionService.insertCollectionCategory(
            {
              category_name: l.title,
              collectionID: numericId,
            },
            Number(pageId),
          );
        if (insertListResult.success) {
          setInitialIds((prev) => new Set(prev).add(l.id));

          // remove all prior errors from the list insert source if service call succeeded
          setErrors((prev) =>
            prev.filter((error) => error.source !== "list:insert"),
          );
        } else {
          allSucceeded = false;

          // set all errors to the previous errors plus add the new error
          // define the id and the source and set its read status to false
          setErrors((prev) => [
            ...prev,
            {
              ...insertListResult.error,
              hasBeenRead: false,
              id: `${Date.now()}-${Math.random()}`,
              source: "list:insert",
            },
          ]);
          setShowError(true);
        }
      } else {
        const updateListResult =
          await collectionService.updateCollectionCategory(
            updateDto,
            Number(pageId),
          );
        if (updateListResult.success) {
          // remove all prior errors from the list update source if service call succeeded
          setErrors((prev) =>
            prev.filter((error) => error.source !== "list:update"),
          );
        } else {
          allSucceeded = false;
          // set all errors to the previous errors plus add the new error
          // define the id and the source and set its read status to false
          setErrors((prev) => [
            ...prev,
            {
              ...updateListResult.error,
              hasBeenRead: false,
              id: `${Date.now()}-${Math.random()}`,
              source: "list:update",
            },
          ]);
          setShowError(true);
        }
      }
    }

    if (allSucceeded) {
      router.back();
    }
  };

  /**
   * Function to confirm the deletion of a list.
   * It checks if the list to delete is valid, then attempts to delete it using the collection service.
   */
  const confirmDelete = async () => {
    if (!listToDelete) return;

    const id = listToDelete.id;

    if (!isNaN(Number(id))) {
      try {
        const deleteListResult =
          await collectionService.deleteCollectionCategoryByID(
            Number(id),
            Number(pageId),
          );

        if (deleteListResult.success) {
          setLists((prev) => prev.filter((l) => l.id !== id));
          setInitialIds((prev) => {
            const updated = new Set(prev);
            updated.delete(id);
            return updated;
          });

          // remove all prior errors from the list delete source if service call succeeded
          setErrors((prev) =>
            prev.filter((error) => error.source !== "list:delete"),
          );
        } else {
          // set all errors to the previous errors plus add the new error
          // define the id and the source and set its read status to false
          setErrors((prev) => [
            ...prev,
            {
              ...deleteListResult.error,
              hasBeenRead: false,
              id: `${Date.now()}-${Math.random()}`,
              source: "list:delete",
            },
          ]);
          setShowError(true);
        }
      } catch (error) {
        console.error("Error deleting list:", error);
      }
    }

    setListToDelete(null);
    setShowDeleteModal(false);
  };

  /**
   * Components used:
   *
   * - GradientBackground: Provides a gradient background for the screen.
   * - Card: A styled card component for displaying content.
   * -CardText: Contains text elements within the card.
   * - CardHeader: A header section for the card.
   * - ThemedText: A text component that adapts to the current theme.
   * - ItemCountContainer: A container for displaying the count of lists.
   * - ItemCount: Displays the number of lists and a maximum limit.
   * - HorizontalTitleRow: A row for displaying the title of each list.
   * - Textfield: A text input field for entering list titles.
   * - RemoveButton: A button to remove a list.
   * - AddButton: A button to add a new list.
   * - BottomButtons: A component for navigation buttons at the bottom.
   * - DeleteModal: A modal for confirming the deletion of a list.
   * - InfoPopup: A modal for displaying help information about collection lists.
   * - ErrorPopup: A modal for displaying errors that have occurred.
   */
  return (
    <GradientBackground
      backgroundCardTopOffset={Platform.select({ ios: 100, android: 95 })}
      topPadding={Platform.select({ ios: 0, android: 0 })}
    >
      {isSmallScreen || isHighCard ? (
        <View style={{ flex: 1 }}>
          {!isLoading && (
            <ScrollView
              contentContainerStyle={{
                ...ListContent,
                paddingBottom: 80,
                paddingTop: 12,
              }}
              showsVerticalScrollIndicator={false}
            >
              <Card>
                <CardText>
                  <CardHeader>
                    <ThemedText fontSize="l" fontWeight="bold">
                      Edit Lists
                    </ThemedText>
                    <TouchableOpacity
                      onPress={() => setShowHelp(true)}
                      style={{
                        minHeight: 48,
                        minWidth: 48,
                        alignSelf: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MaterialIcons
                        name="help-outline"
                        size={26}
                        color={
                          colorScheme === "light"
                            ? Colors.primary
                            : Colors.secondary
                        }
                      />
                    </TouchableOpacity>
                  </CardHeader>
                  <ThemedText
                    fontSize="s"
                    fontWeight="light"
                    colorVariant={
                      colorScheme === "light" ? "grey" : "lightGrey"
                    }
                  >
                    Add Lists to organize your Collections better.
                  </ThemedText>
                </CardText>
              </Card>

              <ItemCountContainer>
                <ItemCount colorScheme={colorScheme}>
                  <ThemedText
                    colorVariant={lists.length < 10 ? "primary" : "red"}
                  >
                    {lists.length}
                  </ThemedText>
                  <ThemedText
                    colorVariant={
                      colorScheme === "light" ? "grey" : "lightGrey"
                    }
                  >
                    /10 Lists
                  </ThemedText>
                </ItemCount>
              </ItemCountContainer>

              {lists.map((item, index) => (
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
                      lists.filter(
                        (l) =>
                          l.title.trim().toLowerCase() ===
                          item.title.trim().toLowerCase(),
                      ).length > 1
                    }
                    maxLength={30}
                  />
                  <RemoveButtonContainer>
                    <RemoveButton onPress={() => handleRemoveCard(item.id)} />
                  </RemoveButtonContainer>
                </Card>
              ))}

              {lists.length < 10 && (
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
          )}
        </View>
      ) : (
        <View
          style={{ flex: 1 }}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setCardHeight(height);
          }}
        >
          <Card>
            <CardText>
              <CardHeader>
                <ThemedText fontSize="l" fontWeight="bold">
                  Edit Lists
                </ThemedText>
                <TouchableOpacity
                  onPress={() => setShowHelp(true)}
                  style={{
                    minHeight: 48,
                    minWidth: 48,
                    alignSelf: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons
                    name="help-outline"
                    size={26}
                    color={
                      colorScheme === "light"
                        ? Colors.primary
                        : Colors.secondary
                    }
                  />
                </TouchableOpacity>
              </CardHeader>
              <ThemedText
                fontSize="s"
                fontWeight="light"
                colorVariant={colorScheme === "light" ? "grey" : "lightGrey"}
              >
                Add Lists to organize your Collections better.
              </ThemedText>
            </CardText>
          </Card>

          <ItemCountContainer>
            <ItemCount colorScheme={colorScheme}>
              <ThemedText colorVariant={lists.length < 10 ? "primary" : "red"}>
                {lists.length}
              </ThemedText>
              <ThemedText
                colorVariant={colorScheme === "light" ? "grey" : "lightGrey"}
              >
                /10 Lists
              </ThemedText>
            </ItemCount>
          </ItemCountContainer>
          {!isLoading && (
            <ScrollView
              contentContainerStyle={{ ...ListContent, paddingBottom: 80 }}
              showsVerticalScrollIndicator={false}
            >
              {lists.map((item, index) => (
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
                      lists.filter(
                        (l) =>
                          l.title.trim().toLowerCase() ===
                          item.title.trim().toLowerCase(),
                      ).length > 1
                    }
                    maxLength={30}
                  />
                  <RemoveButtonContainer>
                    <RemoveButton onPress={() => handleRemoveCard(item.id)} />
                  </RemoveButtonContainer>
                </Card>
              ))}

              {lists.length < 10 && (
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
          )}
        </View>
      )}
      {(Platform.OS !== "android" || !keyboardVisible) && (
        <View
          style={{
            paddingTop: 15,
            paddingBottom: Platform.OS === "android" ? 8 : 24,
          }}
        >
          <BottomButtons
            titleLeftButton="Back"
            titleRightButton="Save"
            onDiscard={() => router.back()}
            onNext={saveAllChanges}
            variant="back"
            hasProgressIndicator={false}
            progressStep={2}
          />
        </View>
      )}
      <DeleteModal
        visible={showDeleteModal}
        title={listToDelete?.title}
        extraInformation="Deleting this list will also remove all its items in the collection. This action cannot be undone."
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        onClose={() => setShowDeleteModal(false)}
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
    </GradientBackground>
  );
}
