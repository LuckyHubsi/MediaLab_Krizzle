import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Keyboard,
  Platform,
  AccessibilityInfo,
  findNodeHandle,
} from "react-native";
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
import { EnrichedError } from "@/shared/error/ServiceError";
import { ErrorPopup } from "@/components/Modals/ErrorModal/ErrorModal";
import { useFocusEffect } from "expo-router";

/**
 * TagManagementScreen that allows users to manage their tags.
 */
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
  const headerRef = useRef<View | null>(null);

  /**
   * Handles the submission of a new or edited tag.
   */
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

          // remove all prior errors from the tag update source if service call succeeded
          setErrors((prev) =>
            prev.filter((error) => error.source !== "tag:update"),
          );
        } else {
          // set all errors to the previous errors plus add the new error
          // define the id and the source and set its read status to false
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

          // remove all prior errors from the tag insert source if service call succeeded
          setErrors((prev) =>
            prev.filter((error) => error.source !== "tag:insert"),
          );
        } else {
          // set all errors to the previous errors plus add the new error
          // define the id and the source and set its read status to false
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

      if (success) {
        setShouldRefetch(true);
        AccessibilityInfo.announceForAccessibility("Tag successfully saved");
      }
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

  /**
   * Deletes a tag by its ID.
   * @param tagID - The ID of the tag to delete.
   */
  const deleteTag = async (tagID: number) => {
    try {
      const deleteResult = await tagService.deleteTagByID(tagID);
      if (deleteResult.success) {
        AccessibilityInfo.announceForAccessibility("Tag successfully deleted");
        setShouldRefetch(true);

        // remove all prior errors from the tag delete source if service call succeeded
        setErrors((prev) =>
          prev.filter((error) => error.source !== "tag:delete"),
        );
      } else {
        // set all errors to the previous errors plus add the new error
        // define the id and the source and set its read status to false
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

  /**
   * Edits an existing tag by setting it to the modal with its current label.
   * @param tagDTO - The TagDTO object containing the tag details to edit.
   */
  const editTag = (tagDTO: TagDTO) => {
    setNewTag(tagDTO.tag_label);
    setEditingTag(tagDTO);
    setEditMode(true);
    setModalVisible(true);
  };

  /**
   * Fetches all tags from the tag service when the component mounts.
   * If the fetch is successful, it updates the tags state.
   */
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagResult = await tagService.getAllTags();
        if (tagResult.success) {
          if (tagResult.value) setTags(tagResult.value);

          // remove all prior errors from the tag retrieval source if service call succeeded
          setErrors((prev) =>
            prev.filter((error) => error.source !== "tags:retrieval"),
          );
        } else {
          // set all errors to the previous errors plus add the new error
          // define the id and the source and set its read status to false
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

  /**
   * Effect to refetch tags when `shouldRefetch` is true.
   */
  useEffect(() => {
    if (!shouldRefetch) return;

    const fetchUpdatedTags = async () => {
      try {
        const tagResult = await tagService.getAllTags();
        if (tagResult.success) {
          if (tagResult.value) setTags(tagResult.value);
          // remove all prior errors from the tag retrieval source if service call succeeded
          setErrors((prev) =>
            prev.filter((error) => error.source !== "tags:retrieval"),
          );
        } else {
          // set all errors to the previous errors plus add the new error
          // define the id and the source and set its read status to false
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

  /**
   * Effect to handle keyboard visibility on Android.
   */
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

  /**
   * sets the screenreader focus to the header after mount
   */
  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(() => {
        const node = findNodeHandle(headerRef.current);
        if (node) {
          AccessibilityInfo.setAccessibilityFocus(node);
        }
      }, 100);

      return () => clearTimeout(timeout);
    }, []),
  );

  /**
   * Components used:
   *
   * - CustomStyledHeader: A custom header component with a title and back navigation.
   * - TagListItem: A component that displays each tag with options to delete or edit.
   * - BottomInputModal: A modal for entering new tags or editing existing ones.
   * - DeleteModal: A modal that confirms the deletion of a tag.
   * - ErrorPopup: A popup that displays errors that occurred during tag operations.
   */
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <CustomStyledHeader
          title="Tags"
          backBehavior="goBackWithParams"
          param={JSON.stringify(tags.length > 0 ? tags[tags.length - 1] : null)}
          headerRef={headerRef}
        />
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
              <Button
                onPress={() => setModalVisible(true)}
                accessibilityLabel="Add Tag Button"
                accessibilityHint="Opens the input modal for adding a new tag"
              >
                Add
              </Button>
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
        placeholderText="Edit or Enter a new tag"
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
        onClose={() => setShowDeleteModal(false)}
      />

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
    </SafeAreaView>
  );
}
