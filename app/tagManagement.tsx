import React, { useEffect, useState } from "react";
import { SafeAreaView, View, FlatList, Keyboard, Platform } from "react-native";
import { TagListItem } from "@/components/ui/TagListItem/TagListItem";
import { ThemedText } from "@/components/ThemedText";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { TagDTO } from "@/dto/TagDTO";
import { Button } from "@/components/ui/Button/Button";
import {
  deleteTagByID,
  getAllTags,
  insertTag,
  updateTag,
} from "@/services/TagService";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import { StatusBar } from "react-native";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";
import { TagInputModal } from "@/components/Modals/TagInputModal/TagInputModal";

export default function TagManagementScreen() {
  const colorScheme = useActiveColorScheme() ?? "light";
  const [tags, setTags] = useState<TagDTO[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingTag, setEditingTag] = useState<TagDTO | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tagtoDelete, setTagToDelete] = useState<TagDTO | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const { showSnackbar } = useSnackbar();

  const handleTagSubmit = async () => {
    const trimmedTag = newTag.trim();

    if (!trimmedTag) return;

    if (!editMode && tags.length >= 100) {
      showSnackbar("You can only have up to 100 tags.", "top", "error");
      return;
    }

    if (trimmedTag.length > 30) {
      showSnackbar("Tag name must be less than 30 characters.", "top", "error");
      return;
    }

    const isDuplicate = tags.some(
      (tag) =>
        tag.tag_label === trimmedTag &&
        (!editMode || tag.tagID !== editingTag?.tagID),
    );

    if (isDuplicate) {
      showSnackbar("A tag with this name already exists.", "top", "error");
      return;
    }

    try {
      let success = false;

      if (editMode && editingTag) {
        success = await updateTag({
          ...editingTag,
          tag_label: trimmedTag,
        });
      } else {
        const newTagObject: TagDTO = { tag_label: trimmedTag };
        success = await insertTag(newTagObject);
      }

      if (success) setShouldRefetch(true);
    } catch (error) {
      console.error("Error saving tag:", error);
    } finally {
      setNewTag("");
      setEditingTag(null);
      setEditMode(false);
      setModalVisible(false);
      Keyboard.dismiss();
    }
  };

  const deleteTag = async (tagID: number) => {
    try {
      const success = await deleteTagByID(tagID);
      if (success) setShouldRefetch(true);
    } catch (error) {
      console.error("Failed to delete tag:", error);
    }
  };

  const editTag = (tagDTO: TagDTO) => {
    setNewTag(tagDTO.tag_label);
    setEditingTag(tagDTO);
    setEditMode(true);
    setModalVisible(true);
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagData = await getAllTags();
        if (tagData) setTags(tagData);
      } catch (error) {
        console.error("Failed to load tags:", error);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    if (!shouldRefetch) return;

    const fetchUpdatedTags = async () => {
      try {
        const tagData = await getAllTags();
        if (tagData) setTags(tagData);
      } catch (error) {
        console.error("Failed to refresh tags:", error);
      } finally {
        setShouldRefetch(false);
      }
    };

    fetchUpdatedTags();
  }, [shouldRefetch]);

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <CustomStyledHeader title="Tags" />
      </View>

      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          backgroundColor: Colors[colorScheme].background,
        }}
      >
        <View style={{ flex: 1 }}>
          {tags.length === 0 && (
            <ThemedText style={{ textAlign: "center", marginTop: 20 }}>
              You don't have any tags yet.
            </ThemedText>
          )}
          <FlatList
            contentContainerStyle={{ paddingBottom: 80 }}
            data={tags}
            keyExtractor={(item) => item.tagID?.toString() || ""}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TagListItem
                tag={item.tag_label}
                onDelete={() => {
                  setTagToDelete(item);
                  setShowDeleteModal(true);
                }}
                onEdit={() => editTag(item)}
                tagCount={item.usage_count}
              />
            )}
          />
        </View>
        {(Platform.OS !== "android" || !keyboardVisible) && (
          <View>
            <Button onPress={() => setModalVisible(true)}>
              <ThemedText colorVariant="white">Add</ThemedText>
            </Button>
          </View>
        )}
      </View>
      <TagInputModal
        visible={modalVisible}
        value={newTag}
        onChangeText={setNewTag}
        onSubmit={handleTagSubmit}
        onClose={() => {
          Keyboard.dismiss();
          setModalVisible(false);
        }}
      />
      <DeleteModal
        visible={showDeleteModal}
        title={tagtoDelete?.tag_label}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (tagtoDelete) {
            try {
              if (tagtoDelete?.tagID !== undefined) {
                await deleteTag(tagtoDelete.tagID);
              }

              setTagToDelete(null);
              setShowDeleteModal(false);
            } catch (error) {
              console.error("Error deleting tag:", error);
            }
          }
        }}
        onclose={() => setShowDeleteModal(false)}
      />
    </SafeAreaView>
  );
}
function setKeyboardVisible(arg0: boolean): void {
  throw new Error("Function not implemented.");
}
