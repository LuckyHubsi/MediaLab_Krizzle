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
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { TagListItem } from "@/components/ui/TagListItem/TagListItem";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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

export default function TagManagementScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const [tags, setTags] = useState<TagDTO[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingTag, setEditingTag] = useState<TagDTO | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const handleTagSubmit = async () => {
    const trimmedTag = newTag.trim();
    if (!trimmedTag) return;

    const isDuplicate = tags.some(
      (tag) =>
        tag.tag_label === trimmedTag &&
        (!editMode || tag.tagID !== editingTag?.tagID),
    );

    if (isDuplicate) {
      alert("A tag with this name already exists.");
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <CustomStyledHeader title="Tags management" />

          <View style={{ flex: 1, marginTop: 20 }}>
            <FlatList
              data={tags}
              keyExtractor={(item) => item.tagID?.toString() || ""}
              renderItem={({ item }) => (
                <TagListItem
                  tag={item.tag_label}
                  onDelete={() => deleteTag(item.tagID || 0)}
                  onEdit={() => editTag(item)}
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
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              Keyboard.dismiss();
              setModalVisible(false);
            }}
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 150,
            }}
          >
            <TouchableWithoutFeedback>
              <View
                style={{
                  width: "85%",
                  height: 58,
                  backgroundColor: colorScheme === "light" ? "#fff" : "#3D3D3D",
                  borderRadius: 33,
                  paddingHorizontal: 20,
                  paddingVertical: 4,
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
                  value={newTag}
                  onChangeText={setNewTag}
                  onSubmitEditing={handleTagSubmit}
                  autoFocus
                />
                <TouchableOpacity onPress={handleTagSubmit}>
                  <MaterialIcons
                    name="arrow-upward"
                    size={28}
                    color={colorScheme === "light" ? "#000" : "#fff"}
                  />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
      </ThemedView>
    </SafeAreaView>
  );
}
