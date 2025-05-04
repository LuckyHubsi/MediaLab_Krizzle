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
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { TagListItem } from "@/components/ui/TagListItem/TagListItem";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ThemedText } from "@/components/ThemedText";
import { TouchableWithoutFeedback } from "react-native";
import { CustomStyledHeader } from "@/components/ui/CustomStyledHeader/CustomStyledHeader";
import { TagDTO } from "@/dto/TagDTO";
import { Button } from "@/components/ui/Button/Button";
import { getAllTags, insertTag } from "@/services/TagService";

export default function TagManagementScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const [tags, setTags] = useState<TagDTO[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTag, setNewTag] = useState("");

  const addTag = async () => {
    if (!newTag.trim()) return;

    const newTagObject: TagDTO = {
      tag_label: newTag.trim(),
    };

    try {
      const success = await insertTag(newTagObject);
      if (success) {
        const updatedTags = await getAllTags();
        setTags(updatedTags);
        setNewTag("");
        setModalVisible(false);
        Keyboard.dismiss();
      }
    } catch (error) {
      console.error("Error adding tag:", error);
    }
  };

  const deleteTag = (tagID: number) => {
    setTags((prev) => prev.filter((t) => t.tagID !== tagID));
  };

  const editTag = (tagID: number) => {
    // future editing logic here
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
                  onEdit={() => editTag(item.tagID || 0)}
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
                  onSubmitEditing={addTag}
                  autoFocus
                />
                <TouchableOpacity onPress={addTag}>
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
