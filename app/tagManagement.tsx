import React, { useEffect, useState } from "react";
import { SafeAreaView, View, FlatList, Keyboard, Platform } from "react-native";
import { TagListItem } from "@/components/ui/TagListItem/TagListItem";
import { ThemedText } from "@/components/ThemedText";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { TagDTO } from "@/shared/dto/TagDTO";
import { Button } from "@/components/ui/Button/Button";
import DeleteModal from "@/components/Modals/DeleteModal/DeleteModal";
import { StatusBar } from "react-native";
import { useActiveColorScheme } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";
import { useSnackbar } from "@/components/ui/Snackbar/Snackbar";
import { BottomInputModal } from "@/components/Modals/BottomInputModal/BottomInputModal";
import { LinearGradient } from "expo-linear-gradient";
import { useServices } from "@/context/ServiceContext";
import { EnrichedError, ServiceErrorType } from "@/shared/error/ServiceError";
import { ErrorPopup } from "@/components/Modals/ErrorModal/ErrorModal";

export default function TagManagementScreen() {
  const { tagService } = useServices();

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

  const [errors, setErrors] = useState<EnrichedError[]>([]);
  const [showError, setShowError] = useState(false);

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
        const updateResult = await tagService.updateTag({
          ...editingTag,
          tag_label: trimmedTag,
        });
        if (updateResult.success) {
          success = true;
          setErrors((prev) =>
            prev.filter((error) => error.source !== "tag:update"),
          );
        } else {
          setErrors((prev) => [
            ...prev,
            {
              ...updateResult.error,
              hasBeenRead: false,
              id: `${Date.now()}-${Math.random()}`,
              source: "tag:update",
            },
          ]);
          setShowError(true);
        }
      } else {
        const newTagObject: TagDTO = { tag_label: trimmedTag };
        const insertResult = await tagService.insertTag(newTagObject);
        if (insertResult.success) {
          success = true;
          setErrors((prev) =>
            prev.filter((error) => error.source !== "tag:insert"),
          );
        } else {
          setErrors((prev) => [
            ...prev,
            {
              ...insertResult.error,
              hasBeenRead: false,
              id: `${Date.now()}-${Math.random()}`,
              source: "tag:insert",
            },
          ]);
          setShowError(true);
        }
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
      const deleteResult = await tagService.deleteTagByID(tagID);
      if (deleteResult.success) {
        setShouldRefetch(true);
        setErrors((prev) =>
          prev.filter((error) => error.source !== "tag:delete"),
        );
      } else {
        setErrors((prev) => [
          ...prev,
          {
            ...deleteResult.error,
            hasBeenRead: false,
            id: `${Date.now()}-${Math.random()}`,
            source: "tag:delete",
          },
        ]);
        setShowError(true);
      }
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
        const tagResult = await tagService.getAllTags();
        if (tagResult.success) {
          if (tagResult.value) setTags(tagResult.value);
          setErrors((prev) =>
            prev.filter((error) => error.source !== "tags:retrieval"),
          );
        } else {
          setErrors((prev) => [
            ...prev,
            {
              ...tagResult.error,
              hasBeenRead: false,
              id: `${Date.now()}-${Math.random()}`,
              source: "tags:retrieval",
            },
          ]);
          setShowError(true);
        }
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
        const tagResult = await tagService.getAllTags();
        if (tagResult.success) {
          if (tagResult.value) setTags(tagResult.value);
          setErrors((prev) =>
            prev.filter((error) => error.source !== "tags:retrieval"),
          );
        } else {
          setErrors((prev) => [
            ...prev,
            {
              ...tagResult.error,
              hasBeenRead: false,
              id: `${Date.now()}-${Math.random()}`,
              source: "tags:retrieval",
            },
          ]);
          setShowError(true);
        }
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
            <LinearGradient
              colors={[
                Colors[colorScheme].background + "00",
                Colors[colorScheme].background + "B0",
                Colors[colorScheme].background + "FF",
              ]}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                paddingTop: 35,
              }}
            >
              <Button onPress={() => setModalVisible(true)}>Add</Button>
            </LinearGradient>
          </View>
        )}
      </View>
      <BottomInputModal
        visible={modalVisible}
        value={newTag}
        onChangeText={setNewTag}
        onSubmit={handleTagSubmit}
        onClose={() => {
          Keyboard.dismiss();
          setModalVisible(false);
        }}
        placeholderText="Enter a new tag"
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

      <ErrorPopup
        visible={showError && errors.some((e) => !e.hasBeenRead)}
        errors={errors.filter((e) => !e.hasBeenRead) || []}
        onClose={(updatedErrors) => {
          const updatedIds = updatedErrors.map((e) => e.id);
          const newCombined = errors.map((e) =>
            updatedIds.includes(e.id) ? { ...e, hasBeenRead: true } : e,
          );
          setErrors(newCombined);
          setShowError(false);
        }}
      />
    </SafeAreaView>
  );
}
function setKeyboardVisible(arg0: boolean): void {
  throw new Error("Function not implemented.");
}
