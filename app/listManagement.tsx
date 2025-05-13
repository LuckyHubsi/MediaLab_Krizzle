import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Keyboard,
  Modal,
  TextInput,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { TagListItem } from "@/components/ui/TagListItem/TagListItem";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedText } from "@/components/ThemedText";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { Button } from "@/components/ui/Button/Button";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import { StatusBar } from "react-native";
import { CollectionCategoryDTO } from "@/dto/CollectionCategoryDTO";
import {
  deleteCollectionCategoryByID,
  getCollectionCategories,
  insertCollectionCategory,
  updateCollectionCategory,
} from "@/services/CollectionCategoriesService";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useActiveColorScheme } from "@/context/ThemeContext";

export default function ListManagementScreen() {
  const { collectionId } = useLocalSearchParams<{
    collectionId: string;
  }>();

  const colorScheme = useActiveColorScheme() ?? "light";
  const [lists, setLists] = useState<CollectionCategoryDTO[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newList, setNewList] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingList, setEditingList] = useState<CollectionCategoryDTO | null>(
    null,
  );
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listToDelete, setListToDelete] =
    useState<CollectionCategoryDTO | null>(null);

  const handleListSubmit = async () => {
    const trimmedList = newList.trim();

    if (!trimmedList) return;

    if (!editMode && lists.length >= 10) {
      alert("You can only have up to 10 lists.");
      return;
    }

    if (trimmedList.length > 30) {
      alert("List name must be 30 characters or less.");
      return;
    }

    // const isDuplicate = lists.some(
    //   (tag) =>
    //     tag.tag_label === trimmedTag &&
    //     (!editMode || tag.tagID !== editingTag?.tagID),
    // );

    // if (isDuplicate) {
    //   alert("A tag with this name already exists.");
    //   return;
    // }

    try {
      let success = false;

      if (editMode && editingList) {
        success = await updateCollectionCategory({
          ...editingList,
          category_name: trimmedList,
        });
      } else {
        const newListObject: CollectionCategoryDTO = {
          category_name: trimmedList,
          collectionID: Number(collectionId),
        };
        success = await insertCollectionCategory(newListObject);
      }

      if (success) setShouldRefetch(true);
    } catch (error) {
      console.error("Error saving list:", error);
    } finally {
      setNewList("");
      setEditingList(null);
      setEditMode(false);
      setModalVisible(false);
      Keyboard.dismiss();
    }
  };

  const deleteList = async (listID: number) => {
    try {
      const success = await deleteCollectionCategoryByID(listID);
      if (success) setShouldRefetch(true);
    } catch (error) {
      console.error("Failed to delete list:", error);
    }
  };

  const editList = (categoryDTO: CollectionCategoryDTO) => {
    setNewList(categoryDTO.category_name);
    setEditingList(categoryDTO);
    setEditMode(true);
    setModalVisible(true);
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const listData = await getCollectionCategories(Number(collectionId));
        if (listData) setLists(listData);
      } catch (error) {
        console.error("Failed to load lists:", error);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    if (!shouldRefetch) return;

    const fetchUpdatedTags = async () => {
      try {
        const listData = await getCollectionCategories(Number(collectionId));
        if (listData) setLists(listData);
      } catch (error) {
        console.error("Failed to refresh lists:", error);
      } finally {
        setShouldRefetch(false);
      }
    };

    fetchUpdatedTags();
  }, [shouldRefetch]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}
    >
      <View
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <CustomStyledHeader title="Edit Lists" />
      </View>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <View style={{ flex: 1 }}>
          <FlatList
            data={lists}
            keyExtractor={(item) => item.collectionCategoryID?.toString() || ""}
            renderItem={({ item }) => (
              <TagListItem
                tag={item.category_name}
                onDelete={() => {
                  if (lists.length > 1) {
                    setListToDelete(item);
                    setShowDeleteModal(true);
                  } else {
                    alert("You must have at least one list.");
                  }
                }}
                onEdit={() => editList(item)}
                tagCountLoading={false}
              />
            )}
          />
        </View>
        <View>
          <Button onPress={() => setModalVisible(true)}>
            <ThemedText colorVariant="white">Add</ThemedText>
          </Button>
        </View>
      </View>
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              Keyboard.dismiss();
              setModalVisible(false);
            }}
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: 20,
            }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  width: "100%",
                  maxWidth: 500,
                  backgroundColor: colorScheme === "light" ? "#fff" : "#3D3D3D",
                  borderRadius: 33,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <TextInput
                  placeholder="New tag name"
                  placeholderTextColor="#999"
                  style={{
                    flex: 1,
                    borderColor: "#ccc",
                    color: colorScheme === "light" ? "#000" : "#fff",
                    paddingVertical: 8,
                    fontSize: 16,
                  }}
                  value={newList}
                  onChangeText={setNewList}
                  onSubmitEditing={handleListSubmit}
                  autoFocus
                />
                <TouchableOpacity onPress={handleListSubmit}>
                  <MaterialIcons
                    name="arrow-upward"
                    size={28}
                    color={colorScheme === "light" ? "#000" : "#fff"}
                  />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
      <DeleteModal
        visible={showDeleteModal}
        title={listToDelete?.category_name}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (listToDelete) {
            try {
              if (listToDelete?.collectionCategoryID !== undefined) {
                await deleteList(listToDelete.collectionCategoryID);
              }

              setListToDelete(null);
              setShowDeleteModal(false);
            } catch (error) {
              console.error("Error deleting list:", error);
            }
          }
        }}
        onclose={() => setShowDeleteModal(false)}
      />
    </SafeAreaView>
  );
}
