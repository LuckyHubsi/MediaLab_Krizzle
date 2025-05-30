import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Platform,
  ScrollView,
  TouchableOpacity,
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
  RemoveButtonContent,
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
        } else {
          // TODO: show error modal
        }
      } catch (err) {
        console.error("Failed to load lists:", err);
        showSnackbar("Failed to load lists.", "top", "error");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [collectionId]);

  const handleAddCard = () => {
    const newCard = { id: Date.now().toString(), title: "" };
    setLists((prev) => [...prev, newCard]);
  };

  const handleRemoveCard = (id: string) => {
    if (lists.length <= 1) {
      showSnackbar("You must have at least one list.", "top", "error");
      return;
    }

    const item = lists.find((l) => l.id === id);
    if (item) {
      setListToDelete(item);
      setShowDeleteModal(true);
    }
  };

  const handleTitleChange = (id: string, text: string) => {
    setLists((prev) =>
      prev.map((l) => (l.id === id ? { ...l, title: text } : l)),
    );
  };

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

    const saveOperations = lists.map(async (l) => {
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
        } else {
          // TODO: show error modal
        }
      } else {
        const updateListResult =
          await collectionService.updateCollectionCategory(updateDto);
        if (!updateListResult.success) {
          // TODO: Show error modal
        }
      }
    });

    await Promise.all(saveOperations);
    router.back();
  };

  const confirmDelete = async () => {
    if (!listToDelete) return;

    const id = listToDelete.id;

    if (!isNaN(Number(id))) {
      try {
        const deleteListResult =
          await collectionService.deleteCollectionCategoryByID(Number(id));

        if (deleteListResult.success) {
          setLists((prev) => prev.filter((l) => l.id !== id));
          setInitialIds((prev) => {
            const updated = new Set(prev);
            updated.delete(id);
            return updated;
          });
        } else {
          // TODO: show error modal
        }
      } catch (error) {
        console.error("Error deleting list:", error);
      }
    }

    setListToDelete(null);
    setShowDeleteModal(false);
  };

  return (
    <GradientBackground
      backgroundCardTopOffset={Platform.select({ ios: 100, android: 95 })}
      topPadding={Platform.select({ ios: 0, android: 15 })}
    >
      <View style={{ flex: 1 }}>
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
                  color={
                    colorScheme === "light" ? Colors.primary : Colors.secondary
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
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
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
          onclose={() => setShowDeleteModal(false)}
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
      </View>
    </GradientBackground>
  );
}
