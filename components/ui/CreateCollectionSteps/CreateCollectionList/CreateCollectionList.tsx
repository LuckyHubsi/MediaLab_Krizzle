import React, { useState, FC } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { FlatList, TouchableOpacity, useColorScheme, View } from "react-native";
import { ThemedView } from "@/components/ui/ThemedView/ThemedView";
import { Card } from "@/components/ui/Card/Card";
import { Header } from "@/components/ui/Header/Header";
import { Button } from "@/components/ui/Button/Button";
import { AddButton } from "@/components/ui/AddButton/AddButton";
import { ThemedText } from "@/components/ThemedText";
import {
  Container,
  AddButtonWrapper,
  ListContent,
  NextButtonWrapper,
  RemoveButton,
  RemoveButtonContent,
} from "./CreateCollectionList.styles";
import Textfield from "../../Textfield/Textfield";
import { MaterialIcons } from "@expo/vector-icons";
import { IconTopRight } from "../../IconTopRight/IconTopRight";
import { Colors } from "@/constants/Colors";

const CreateCollectionList: FC = () => {
  const [cards, setCards] = useState<{ id: string }[]>([]);
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  const handleAddCard = () => {
    const newCard = { id: Date.now().toString() };
    setCards((prevCards) => [...prevCards, newCard]);
  };

  const handleNext = () => {
    router.push("./collectionTemplate");
  };

  const handleRemoveCard = (id: string) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
  };

  const colorScheme = useColorScheme();
  const iconColor =
    colorScheme === "dark" ? Colors.dark.text : Colors.light.text;

  return (
    <>
      <Container>
        <Card>
          <IconTopRight>
            <TouchableOpacity onPress={() => setShowHelp(true)}>
              <MaterialIcons name="help-outline" size={26} color={iconColor} />
            </TouchableOpacity>
          </IconTopRight>
          <Header title="Adding Lists" />
          <View style={{ marginLeft: 15 }}>
            <ThemedText fontSize="s" fontWeight="light">
              Add Lists to organize your Collections
            </ThemedText>
          </View>
        </Card>

        <FlatList
          style={{ marginBottom: 90 }}
          data={cards}
          keyExtractor={(item) => item.id}
          contentContainerStyle={ListContent}
          renderItem={({ item }) => (
            <Card>
              <ThemedText
                fontSize="regular"
                fontWeight="regular"
                style={{ marginBottom: 15 }}
              >
                List {cards.findIndex((card) => card.id === item.id) + 1}
              </ThemedText>
              <Textfield
                showTitle={false}
                textfieldIcon="text-fields"
                placeholderText={`Add a title to your note`}
                title={""}
                value={""}
                onChangeText={() => {}}
              />
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
            </Card>
          )}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <AddButtonWrapper>
              <AddButton onPress={handleAddCard} />
            </AddButtonWrapper>
          }
        />

        <NextButtonWrapper>
          <Button onPress={handleNext}>Next</Button>
        </NextButtonWrapper>
      </Container>

      {showHelp && (
        <View
          style={{
            position: "absolute",
            top: 100,
            left: 20,
            right: 20,
            backgroundColor:
              colorScheme === "dark"
                ? Colors.dark.cardBackground
                : Colors.light.cardBackground,
            borderRadius: 12,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 6,
            zIndex: 10,
          }}
        >
          <TouchableOpacity
            style={{ position: "absolute", top: 8, right: 8 }}
            onPress={() => setShowHelp(false)}
          >
            <MaterialIcons name="close" size={20} color={iconColor} />
          </TouchableOpacity>
          <ThemedText
            fontSize="s"
            fontWeight="regular"
            style={{ marginTop: 16 }}
          >
            You can add multiple lists to your collection here. Tap the '+' to
            create new ones. Use 'Next' to continue.
          </ThemedText>
        </View>
      )}
    </>
  );
};

export default CreateCollectionList;
